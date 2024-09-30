import { Directionality } from '@angular/cdk/bidi'
import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  hasModifierKey,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes'
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
} from '@angular/cdk/overlay'
import { _getEventTarget } from '@angular/cdk/platform'
import { TemplatePortal } from '@angular/cdk/portal'
import { DOCUMENT } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectorRef,
  computed,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  input,
  numberAttribute,
  OnDestroy,
  Optional,
  signal,
  untracked,
  ViewContainerRef,
} from '@angular/core'
import {
  outputToObservable,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { CkFormField } from '@corekit/ui/form-field'
import { CkOption } from '@corekit/ui/option'
import {
  filter,
  firstValueFrom,
  fromEvent,
  map,
  merge,
  Observable,
  startWith,
  switchMap,
} from 'rxjs'
import { CkAutocomplete } from './autocomplete'
import { CkAutocompleteOrigin } from './autocomplete-origin'
import { CK_AUTOCOMPLETE_SCROLL_STRATEGY } from './scroll-strategy.token'

type AutocompletePosition = 'auto' | 'above' | 'below'

const CONTROL_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CkAutocompleteTrigger),
  multi: true,
}

/**
 * Directive that adds autocomplete feature to an input or a textarea.
 */
@Directive({
  selector: 'input[ck-autocomplete-trigger-for]',
  exportAs: 'ckAutocompleteTrigger',
  standalone: true,
  providers: [CONTROL_VALUE_ACCESSOR_PROVIDER],
  host: {
    '[attr.role]': 'autocompleteDisabled() ? null : "combobox"',
    '[attr.aria-autocomplete]': 'autocompleteDisabled() ? null : "list"',
    '[attr.aria-activedescendant]':
      'autocomplete().isOpen() ? autocomplete().activeOption()?.id() : null',
    '[attr.aria-expanded]': 'autocomplete().isOpen()',
    '[attr.aria-controls]':
      '(!autocompleteDisabled() && autocomplete().isOpen()) ? autocomplete().id : null',
    '[attr.aria-haspopup]': 'autocompleteDisabled() ? null : "listbox"',
    '(click)': 'openPanel()',
    '(focus)': '_openViaFocus()',
    '(keydown)': '_handleKeydown($event)',
    '(input)':
      'openPanel(this._displayValueOnKeydown()); !autocomplete().requireSelection() && _setValueViaInput($event)',
    '(blur)': '_closeViaBlur()',
  },
})
export class CkAutocompleteTrigger
  implements OnDestroy, ControlValueAccessor, CkAutocompleteOrigin
{
  /** Whether the autocomplete feature is disabled. */
  public readonly autocompleteDisabled = input<boolean, unknown>(false, {
    alias: 'ckAutocompleteDisabled',
    transform: booleanAttribute,
  })

  /** The autocomplete this trigger should control. */
  public readonly autocomplete = input.required<CkAutocomplete>({
    alias: 'ck-autocomplete-trigger-for',
  })

  /**
   * Reference of an element which the autocomplete suggestion panel should be
   * attached to. Defaults to the current trigger.
   */
  public readonly connectedTo = input<CkAutocompleteOrigin | undefined>(
    undefined,
    {
      alias: 'ckAutocompleteConnectedTo',
    },
  )

  /**
   * Position of the suggestion panel relative to the
   * {@link connectedTo `connectedTo`} element.
   *
   * `auto` will render the panel under the `connectedTo` element when there's
   * enough space, and fallback to the top of it otherwise.
   *
   * `above` will forcefully render the panel above the `connectedTo` element.
   *
   * `below` will forcefully render the panel above the `connectedTo` element.
   */
  public readonly position = input<AutocompletePosition>('auto', {
    alias: 'ckAutocompletePosition',
  })

  /** Whether the suggestion panel is open. */
  public readonly isPanelOpen = computed(() => {
    return this._overlayAttached() && !!this.autocomplete().options().length
  })

  /**
   * Whether the suggestion panel can be opened the next time it is focused.
   * Used to prevent a explicitly closed autocomplete from being reopened when
   * user switches to another browser tab and then comes back.
   */
  protected readonly _canOpenOnNextFocus = signal(true)

  /**
   * See {@link connectedTo `connectedTo`}. Use this over the original field for
   * null safety and fallback to current trigger.
   */
  private readonly _origin = computed(
    (): CkAutocompleteOrigin => this.connectedTo() ?? this,
  )

  private readonly _dropdownOriginWidth = toSignal(
    toObservable(this._origin).pipe(
      filter(Boolean),
      switchMap(origin => this._widthChanges(origin.host.nativeElement)),
    ),
  )

  private readonly _canOpen = computed(() => {
    const element = this.host.nativeElement

    return (
      !element.readOnly && !element.disabled && !this.autocompleteDisabled()
    )
  })

  private _portal: TemplatePortal | undefined
  private readonly _overlayRef = signal<OverlayRef | undefined>(undefined)

  private readonly _overlayPositionStrategy = toSignal(
    toObservable(this._overlayRef).pipe(
      filter(Boolean),
      map(overlayRef => {
        return overlayRef.getConfig()
          .positionStrategy as FlexibleConnectedPositionStrategy
      }),
    ),
  )

  private readonly _formControlValue = signal<unknown>(null)
  private readonly _displayValueOnOpen = signal<unknown>(null)

  private readonly _displayValueOnKeydown = toSignal(
    merge(
      toObservable(this.autocomplete).pipe(
        switchMap(autocomplete => outputToObservable(autocomplete.opened)),
      ),
      fromEvent(this.host.nativeElement, 'keydown'),
    ).pipe(
      map(event => {
        if (!event && !this._overlayAttached()) return null

        return event
          ? _getEventTarget<HTMLInputElement>(event)?.value
          : this.host.nativeElement.value
      }),
    ),
    { initialValue: null },
  )

  private readonly _windowBlur = toSignal(
    fromEvent<FocusEvent>(this._document.defaultView ?? window, 'blur'),
  )

  private readonly _outsideClick = toSignal(
    toObservable(this._overlayRef).pipe(
      filter(Boolean),
      switchMap(overlayRef => overlayRef.outsidePointerEvents()),
      filter(event => {
        const target = _getEventTarget<HTMLElement>(event)

        return !this._origin().host.nativeElement.contains(target)
      }),
    ),
  )

  private readonly _overlayAttached = toSignal(
    toObservable(this._overlayRef).pipe(
      filter(Boolean),
      switchMap(overlayRef => {
        return merge(
          overlayRef.attachments().pipe(startWith(true)),
          overlayRef.detachments(),
        ).pipe(map(() => overlayRef))
      }),
      map(overlayRef => overlayRef.hasAttached()),
    ),
    { initialValue: false },
  )

  constructor(
    /** HTML Element of the trigger. */
    public readonly host: ElementRef<HTMLInputElement>,
    @Optional()
    @Host()
    private readonly _formField: CkFormField,
    @Optional()
    private readonly _directionality: Directionality,
    @Optional()
    @Inject(DOCUMENT)
    private readonly _document: Document,
    @Inject(CK_AUTOCOMPLETE_SCROLL_STRATEGY)
    private readonly _scrollStrategy: ScrollStrategy,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _overlay: Overlay,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {
    effect(this._windowBlurEffect.bind(this), { allowSignalWrites: true })
    effect(this._originChangeEffect.bind(this))
    effect(this._originWidthChangeEffect.bind(this))
    effect(this._positionChangeEffect.bind(this))
    effect(this._outsideClickEffect.bind(this))
    effect(this._optionsChangesEffect.bind(this))
    effect(this._optionsSelectionChangeEffect.bind(this), {
      allowSignalWrites: true,
    })
  }

  public async ngOnDestroy(): Promise<void> {
    if (!this._overlayRef()) return

    await this.closePanel()
    this._overlayRef()!.dispose()
  }

  public writeValue(value: unknown): void {
    // TODO: This fixes a bug, where option is not selected when value is set
    // programmatically. Report in Material repo.
    this.autocomplete()._selectOptionByValue(value, false)
    this._updateNativeInputValue(value)
    this._formControlValue.set(value)
  }

  public registerOnChange(onChange: (value: unknown) => void): void {
    this._onChange = (value: unknown): void => {
      onChange(value)
      this._formControlValue.set(value)
    }
  }

  public registerOnTouched(onTouched: () => void): void {
    this._onTouched = onTouched
  }

  public setDisabledState(disabled: boolean): void {
    this.host.nativeElement.disabled = disabled
  }

  /**
   * Opens autocomplete suggestion panel.
   *
   * @param value Value at the moment of opening. Defaults to the most recent
   * trigger value.
   */
  public openPanel(value?: unknown): void {
    if (this.autocomplete().isOpen() || !this._canOpen()) return

    const safeValue = value ?? this.host.nativeElement.value

    if (!this._overlayRef()) {
      this._portal = new TemplatePortal(
        this.autocomplete()._template(),
        this._viewContainerRef,
        { labelId: this._formField.labelId() },
      )

      this._overlayRef.set(this._overlay.create(this._getOverlayConfig()))
    }

    if (!this._overlayAttached()) {
      this._overlayRef()!.attach(this._portal)
      this._displayValueOnOpen.set(safeValue)
    }

    this.autocomplete()._open(this)
  }

  /** Closes the suggestion panel. */
  public async closePanel(): Promise<void> {
    if (this.autocomplete()._trigger() === this) this.autocomplete()._close()

    await firstValueFrom(this.autocomplete()._animationEnd)

    this._overlayRef()!.detach()
  }

  /**
   * Updates suggestion panel position.
   *
   * @param position If provided, sets the new position, otherwise updates panel
   * to conform with the previous positioning.
   */
  public updatePosition(position?: AutocompletePosition): void {
    if (position) {
      this._overlayPositionStrategy()?.withPositions(
        this._getOverlayPositions(position),
      )
    }

    this._overlayRef()?.updatePosition()
  }

  /** Sets form control value */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onChange: (value: unknown) => void = () => null

  /** Marks form control as touched. */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onTouched: () => void = () => null

  /** Opens autocomplete dropdown if it can be opened by focusing the trigger. */
  protected _openViaFocus(): void {
    if (!this._canOpenOnNextFocus()) return this._setCanOpenOnNextFocus(true)
    this.openPanel()
  }

  /** Routes different key/combination presses to respective features. */
  protected _handleKeydown(event: KeyboardEvent): void {
    if (this._isOpeningKeydownEvent(event)) {
      this.openPanel(this._displayValueOnKeydown())
    }

    if (this._isClosingKeydownEvent(event)) {
      void this._setValueAndClose(null)
    }

    if (this._isNavigationKeydownEvent(event)) {
      this.autocomplete()._navigate(event)
    }

    if (this._isSelectionKeydownEvent(event)) {
      this.autocomplete()._deselectAll()
      this.autocomplete().activeOption()?.select()
    }
  }

  /**
   * Handles user typing input. Used when
   * {@link CkAutocomplete.requireSelection `CkAutocomplete.requireSelection`}
   * is not enabled.
   */
  protected _setValueViaInput(event: InputEvent): void {
    const value = this._coerceNumberInput(
      _getEventTarget<HTMLInputElement>(event)!,
    )

    this._setValue(value, false)

    this.updatePosition(this.position())
    this._changeDetectorRef.detectChanges()

    const selectedOption = this.autocomplete().selectedOption()

    if (!selectedOption) return

    const displayValue = this._getDisplayValue(
      selectedOption.value() as unknown,
    )

    if (value !== displayValue) selectedOption.deselect()
  }

  protected _closeViaBlur(): void {
    this._onTouched()
    this._setCanOpenOnNextFocus(true)
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this._scrollStrategy,
      width: this._dropdownOriginWidth(),
      maxHeight: 170,
      direction: this._directionality,
    })
  }

  private _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
    return (
      this._overlay
        .position()
        .flexibleConnectedTo(this._origin().host)
        .withPositions(this._getOverlayPositions(this.position()))
        .withPush(false)
        // Apply margins to avoid clipping the dropdown by viewport
        .withFlexibleDimensions(true)
        .withGrowAfterOpen(true)
        .withViewportMargin(6)
    )
  }

  private _getOverlayPositions(
    position: AutocompletePosition,
  ): ConnectedPosition[] {
    const offsetY = 4

    const below: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY,
        panelClass: 'group/ck-position-below',
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY,
        panelClass: 'group/ck-position-below',
      },
    ]

    const above: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -offsetY,
        panelClass: 'group/ck-position-above',
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -offsetY,
        panelClass: 'group/ck-position-above',
      },
    ]

    const positions = { above, below, auto: [...below, ...above] }

    return positions[position]
  }

  private _updateNativeInputValue(
    value: unknown,
    processDisplayWith = true,
  ): void {
    const displayValue = processDisplayWith
      ? this._getDisplayValue(value)
      : value

    this.host.nativeElement.value = (displayValue as string | null) ?? ''
  }

  private _coerceNumberInput(
    element: HTMLInputElement,
  ): string | number | null {
    if (element.type !== 'number') return element.value

    return numberAttribute(element.value) || null
  }

  /**
   * Depending on the provided option, decides whether to set specific value or
   * reset everything and closes the dropdown.
   */
  private async _setValueAndClose(
    optionToSelect: CkOption | null,
  ): Promise<void> {
    if (optionToSelect?.isSelected()) {
      this.autocomplete()._deselectAll(optionToSelect)
      this._setValue(optionToSelect.value())
      this.host.nativeElement.focus()

      return this.closePanel()
    }

    const typedValueUnacceptable =
      this.host.nativeElement.value !== this._displayValueOnOpen() &&
      this.host.nativeElement.value !== this._formControlValue()

    if (typedValueUnacceptable) {
      this.autocomplete()._deselectAll()
      this._setValue(null)
    }

    if (!optionToSelect) return this.closePanel()
  }

  private _setValue(value: unknown, updateDisplayValue = true): void {
    updateDisplayValue && this._updateNativeInputValue(value ?? null)

    // TODO: this should wait until the animation is done, otherwise the value
    // gets reset while the panel is still animating which looks glitchy. It'll likely break
    // some tests to change it at this point.
    this._onChange(value ?? null)
  }

  /**
   * Given a value, returns a string that should be shown within the input
   * calculated by {@link CkAutocomplete.displayWith `CkAutocomplete.displayWith`}.
   */
  private _getDisplayValue<T = unknown>(value: T): T | string {
    const displayWith = this.autocomplete().displayWith()

    return displayWith ? displayWith(value) : value
  }

  private _setCanOpenOnNextFocus(canOpenOnNextFocus?: boolean): void {
    this._canOpenOnNextFocus.set(
      canOpenOnNextFocus ??
        (this._document.activeElement !== this.host.nativeElement ||
          this.autocomplete().isOpen()),
    )
  }

  private _widthChanges(element: HTMLElement): Observable<number> {
    return new Observable(subscriber => {
      const resizeObserver = new ResizeObserver(entries => {
        const [width] = entries.map(
          ({ borderBoxSize: [{ inlineSize }] }) => inlineSize,
        )

        return subscriber.next(width)
      })

      resizeObserver.observe(element)

      return function unsubscribe() {
        resizeObserver.unobserve(element)
      }
    })
  }

  private _isOpeningKeydownEvent({ keyCode }: KeyboardEvent): boolean {
    return keyCode === UP_ARROW || keyCode === DOWN_ARROW
  }

  private _isSelectionKeydownEvent(event: KeyboardEvent): boolean {
    return (
      this.autocomplete().isOpen() &&
      !this.autocomplete().activeOption()?.disabled &&
      event.keyCode === ENTER &&
      !hasModifierKey(event)
    )
  }

  private _isClosingKeydownEvent(event: KeyboardEvent): boolean {
    return (
      ((event.keyCode === TAB && !hasModifierKey(event, 'ctrlKey')) ||
        (event.keyCode === ESCAPE && !hasModifierKey(event)) ||
        (event.keyCode === UP_ARROW && hasModifierKey(event, 'altKey'))) &&
      this._overlayAttached()
    )
  }

  private _isNavigationKeydownEvent(event: KeyboardEvent): boolean {
    return (
      (event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW) &&
      !hasModifierKey(event) &&
      this.autocomplete().isOpen()
    )
  }

  /**
   * Runs when user leaves the browser tab.
   *
   * Sets a flag will tell if the dropdown can be opened next time window is
   * focused.
   */
  private _windowBlurEffect(): void {
    this._windowBlur()
    untracked(this._setCanOpenOnNextFocus.bind(this))
  }

  /**
   * Runs when {@link _dropdownOriginWidth `_dropdownOriginWidth`} changes.
   *
   * Updates dropdown width to match origin width.
   */
  private _originWidthChangeEffect(): void {
    this._overlayRef()?.updateSize({ width: this._dropdownOriginWidth() })
  }

  /**
   * Runs when dropdown opened status and user commanded {@link position}
   * changes.
   *
   * Updates dropdown position.
   */
  private _positionChangeEffect(): void {
    if (this.autocomplete().isOpen()) this.updatePosition(this.position())
  }

  /**
   * Runs when {@link _origin `_dropdownOrigin`} changes.
   *
   * Updates dropdown origin.
   */
  private _originChangeEffect(): void {
    this._overlayPositionStrategy()?.setOrigin(this._origin().host)
  }

  /**
   * Runs when options change.
   *
   * `@for()` renders new DOM elements representing new options' list each time options
   * change as a result of filtering. When currently selected option matches new
   * filter criteria, it will not be shown as selected, because it's a completely
   * new `CkOption` instance and DOM element. This effect _visually_ re-selects
   * newly-rendered-but-already-selected option.
   */
  private _optionsChangesEffect(): void {
    this.autocomplete().options()

    untracked(() => {
      if (!this.autocomplete().requireSelection()) return

      this.autocomplete()._selectOptionByValue(this._formControlValue(), false)
    })
  }

  /**
   * Runs when an option is selected.
   *
   * Sets the value and closes the dropdown.
   */
  private _optionsSelectionChangeEffect(): void {
    const selectionChange = this.autocomplete()._selectionChange()

    if (!selectionChange || !untracked(this._overlayAttached)) return

    untracked(() => {
      this.updatePosition(this.position())
      void this._setValueAndClose(selectionChange.source)
    })
  }

  /**
   * Runs when user clicks outside the trigger and dropdown area.
   *
   * Selects pending autoselected option or resets if none or feature disabled.
   */
  private _outsideClickEffect(): void {
    if (!this._outsideClick() || !untracked(this._overlayAttached)) return

    untracked(() => void this._setValueAndClose(null))
  }
}
