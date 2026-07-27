import { ActiveDescendantKeyManager } from '@angular/cdk/a11y'
import { Directionality } from '@angular/cdk/bidi'
import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  hasModifierKey,
  SPACE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes'
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
} from '@angular/cdk/overlay'
import { _getEventTarget } from '@angular/cdk/platform'
import { TemplatePortal } from '@angular/cdk/portal'
import { isPlatformBrowser, NgClass } from '@angular/common'
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  Injector,
  input,
  linkedSignal,
  OnDestroy,
  Optional,
  output,
  PLATFORM_ID,
  signal,
  TemplateRef,
  untracked,
  viewChild,
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
import { classNames, getScrollPosition } from '@corekit/ui/utils'
import {
  EMPTY,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  switchMap,
} from 'rxjs'
import { CK_SELECT_SCROLL_STRATEGY } from './scroll-strategy.token'
import { selectPanelStyles, selectTriggerStyles } from './select.styles'

type SelectPosition = 'auto' | 'above' | 'below'

const CONTROL_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CkSelect),
  multi: true,
}

let uniqueIdCounter = 0

/**
 * Dropdown component allowing to pick a single value from the list of options.
 *
 * Composes `CkOption` and integrates with `CkFormField` and Angular forms.
 */
@Component({
  selector: 'ck-select',
  exportAs: 'ckSelect',
  imports: [NgClass],
  templateUrl: './select.html',
  providers: [CONTROL_VALUE_ACCESSOR_PROVIDER],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'combobox',
    'aria-haspopup': 'listbox',
    '[id]': 'id()',
    '[class]': '_class()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'isOpen() ? panelId : null',
    '[attr.aria-activedescendant]': 'isOpen() ? activeOption()?.id() : null',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-required]': 'required()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': '_ariaLabelledby()',
    '(click)': '_toggle()',
    '(keydown)': '_handleKeydown($event)',
    '(blur)': '_onTouched()',
  },
})
export class CkSelect implements ControlValueAccessor, OnDestroy {
  public readonly class = input<string>()

  /** CSS classes to be applied to the dropdown panel. */
  public readonly panelClass = input<string>()

  /** The unique ID of the select trigger. */
  public readonly id = input(`ck-select-${uniqueIdCounter++}`)

  /** Text shown in the trigger when no value is selected. */
  public readonly placeholder = input<string>('')

  /** Whether the select is disabled. */
  public readonly commandedDisabled = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  })

  /** Whether the select is required. Reflected to `aria-required`. */
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /** Value of the select. */
  public readonly commandedValue = input<unknown>(null, { alias: 'value' })

  /**
   * Function comparing an option value with the selected value. The first
   * argument is a value from an option, the second one — the selected value.
   */
  public readonly compareWith = input<(o1: unknown, o2: unknown) => boolean>(
    (o1, o2) => o1 === o2,
  )

  /**
   * Position of the dropdown panel relative to the trigger.
   *
   * `auto` will render the panel under the trigger when there's enough space,
   * and fallback to the top of it otherwise.
   *
   * `above` will forcefully render the panel above the trigger.
   *
   * `below` will forcefully render the panel below the trigger.
   */
  public readonly position = input<SelectPosition>('auto')

  public readonly ariaLabel = input<string | undefined>(undefined, {
    alias: 'aria-label',
  })

  public readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: 'aria-labelledby',
  })

  /** Event emitted when the value changes as a result of user selection. */
  public readonly valueChange = output<unknown>()

  /** Event emitted when the dropdown panel is opened. */
  public readonly opened = output()

  /** Event emitted when the dropdown panel is closed. */
  public readonly closed = output()

  /** Unique ID of the dropdown panel. */
  public readonly panelId = `ck-select-panel-${uniqueIdCounter++}`

  /** All select options. */
  public readonly options = contentChildren(CkOption, { descendants: true })

  /** Whether the dropdown panel is open. */
  public readonly isOpen = computed(() => this._state() === 'open')

  /** Whether the select is disabled by input or a form control. */
  public readonly disabled = computed(() => this._disabled())

  /** Value of the select. */
  public readonly value = computed(() => this._value())

  /** Currently selected option. */
  public readonly selectedOption = computed(() => {
    return this.options().find(option => option.isSelected())
  })

  /** Label of the selected option shown in the trigger. */
  public readonly displayValue = computed(() => {
    // Recompute when selection changes; `getLabel()` itself is not reactive.
    return this.selectedOption()?.getLabel() ?? ''
  })

  /** Manages keyboard navigation in the options list. */
  private readonly _keyManager = new ActiveDescendantKeyManager(
    this.options,
    this._injector,
  )
    .withWrap()
    .withHomeAndEnd()
    .withTypeAhead()
    // Disallow skipping disabled options when navigating. This is to conform
    // with https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
    .skipPredicate(() => false)

  /** Currently active (fake focused with keyboard) option. */
  public readonly activeOption = toSignal(
    this._keyManager.change.pipe(map(index => this.options()[index])),
  )

  protected readonly _class = computed(() => {
    return classNames(selectTriggerStyles(), this.class())
  })

  protected readonly _panelClass = computed(() => {
    return classNames(
      selectPanelStyles({ state: this._state() }),
      this.options().length ? 'visible' : 'invisible pointer-events-none',
      this.panelClass(),
    )
  })

  protected readonly _ariaLabelledby = computed(() => {
    if (this.ariaLabel()) return null

    const ids = [this._formField?.labelId(), this.ariaLabelledby()]

    return ids.filter(Boolean).join(' ') || null
  })

  /** Reflects current panel state. */
  protected readonly _state = signal<'open' | 'closed'>('closed')

  /** Writable of {@link disabled `disabled`}. */
  private readonly _disabled = linkedSignal(() => this.commandedDisabled())

  /** Writable of {@link value `value`}. */
  private readonly _value = linkedSignal<unknown>(() => this.commandedValue())

  /** Stream of changes to the selection state of the options. */
  private readonly _selectionChange = toSignal(
    toObservable(this.options).pipe(
      switchMap(options => {
        return merge(
          ...options.map(option => outputToObservable(option.selectionChange)),
        )
      }),
    ),
  )

  /** Reference to the template of the dropdown panel. */
  private readonly _template = viewChild.required<TemplateRef<void>>('template')

  /** HTML Element containing the list of options. */
  private readonly _panel = viewChild<ElementRef<HTMLDivElement>>('panel')

  private readonly _overlayRef = signal<OverlayRef | undefined>(undefined)
  private _portal: TemplatePortal | undefined

  private readonly _positionStrategy = this._overlay
    .position()
    .flexibleConnectedTo(this.host)
    .withPositions(this._getOverlayPositions(this.position()))
    .withPush(false)
    // Apply margins to avoid clipping the dropdown by viewport
    .withFlexibleDimensions(true)
    .withGrowAfterOpen(true)
    .withViewportMargin(6)

  private readonly _hostWidth = toSignal(this._widthChanges())

  private readonly _overlayConfig = new OverlayConfig({
    positionStrategy: this._positionStrategy,
    scrollStrategy: this._scrollStrategy(),
    width: this._hostWidth(),
    maxHeight: 256,
    direction: this._directionality,
  })

  /**
   * Stream of clicks on the label of the enclosing form field.
   *
   * Native `label[for]` association doesn't work with a non-labelable element,
   * so focusing on label click is wired up manually.
   */
  private readonly _labelClick = toSignal(
    toObservable(computed(() => this._formField?.label())).pipe(
      switchMap(label => {
        if (!label) return EMPTY

        return fromEvent<MouseEvent>(label.host.nativeElement, 'click')
      }),
    ),
  )

  private readonly _outsideClick = toSignal(
    toObservable(this._overlayRef).pipe(
      filter(Boolean),
      switchMap(overlayRef => overlayRef.outsidePointerEvents()),
      filter(event => {
        const target = _getEventTarget<HTMLElement>(event)

        return !this.host.nativeElement.contains(target)
      }),
    ),
  )

  constructor(
    /** HTML Element of the select trigger. */
    public readonly host: ElementRef<HTMLElement>,
    @Optional()
    @Host()
    private readonly _formField: CkFormField | null,
    @Optional()
    private readonly _directionality: Directionality,
    @Inject(CK_SELECT_SCROLL_STRATEGY)
    private readonly _scrollStrategy: () => ScrollStrategy,
    @Inject(PLATFORM_ID)
    private readonly _platformId: object,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _overlay: Overlay,
    private readonly _injector: Injector,
  ) {
    effect(this._scrollToActiveOptionEffect.bind(this))
    effect(this._hostWidthChangeEffect.bind(this))
    effect(this._positionChangeEffect.bind(this))
    effect(this._outsideClickEffect.bind(this))
    effect(this._labelClickEffect.bind(this))
    effect(this._selectionChangeEffect.bind(this))
    // This particular effect must be executed only after Angular finishes
    // rendering as it tries to access `CkOption.value` input, which is required,
    // but is not provided until the option is actually rendered.
    afterRenderEffect({ read: this._syncSelectionEffect.bind(this) })
  }

  public ngOnDestroy(): void {
    this._keyManager.destroy()
    this._overlayRef()?.dispose()
  }

  public writeValue(value: unknown): void {
    this._value.set(value)
  }

  public registerOnChange(onChange: (value: unknown) => void): void {
    this._onChange = onChange
  }

  public registerOnTouched(onTouched: () => void): void {
    this._onTouched = onTouched
  }

  public setDisabledState(disabled: boolean): void {
    this._disabled.set(disabled)

    if (disabled) this.close()
  }

  /** Opens the dropdown panel. */
  public open(): void {
    if (this.isOpen() || this.disabled()) return

    if (!this._overlayRef()) {
      this._portal = new TemplatePortal(
        this._template(),
        this._viewContainerRef,
      )

      this._overlayRef.set(this._overlay.create(this._overlayConfig))
    }

    if (!this._overlayRef()!.hasAttached()) {
      this._overlayRef()!.attach(this._portal)
      this._overlayRef()!.updateSize({ width: this._hostWidth() })
    }

    this._state.set('open')
    this._activateInitialOption()
    this.opened.emit()
  }

  /** Closes the dropdown panel. */
  public close(): void {
    if (!this.isOpen()) return

    this._state.set('closed')
    this.closed.emit()
  }

  /**
   * Updates dropdown panel position.
   *
   * @param position If provided, sets the new position, otherwise updates panel
   * to conform with the previous positioning.
   */
  public updatePosition(position?: SelectPosition): void {
    if (position) {
      this._positionStrategy.withPositions(this._getOverlayPositions(position))
    }

    this._overlayRef()?.updatePosition()
  }

  /** Sets form control value. */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onChange: (value: unknown) => void = () => null

  /** Marks form control as touched. */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onTouched: () => void = () => null

  protected _toggle(): void {
    return this.isOpen() ? this.close() : this.open()
  }

  /** Routes different key/combination presses to respective features. */
  protected _handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return

    return this.isOpen()
      ? this._handleOpenKeydown(event)
      : this._handleClosedKeydown(event)
  }

  /** Detaches the dropdown panel after closing animation completes. */
  protected _onPanelAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'exit') this._overlayRef()?.detach()
  }

  private _handleClosedKeydown(event: KeyboardEvent): void {
    if (!this._isOpeningKeydownEvent(event)) return

    event.preventDefault()
    this.open()
  }

  private _handleOpenKeydown(event: KeyboardEvent): void {
    if (this._isClosingKeydownEvent(event)) {
      event.keyCode !== TAB && event.preventDefault()

      return this.close()
    }

    if (this._isSelectionKeydownEvent(event)) {
      event.preventDefault()

      return this._selectActiveOption()
    }

    // Arrows, Home/End and typeahead.
    this._keyManager.onKeydown(event)
  }

  /** Selects currently active option and closes the dropdown. */
  private _selectActiveOption(): void {
    const option = this.activeOption()

    if (!option || option.disabled) return
    if (option.isSelected()) return this.close()

    option.select()
  }

  private _setValue(value: unknown): void {
    this._value.set(value)
    this._onChange(value)
    this.valueChange.emit(value)
  }

  /** Marks selected option as active, or the first enabled one if none. */
  private _activateInitialOption(): void {
    const options = this.options()
    const selected = this.selectedOption()

    const index = selected
      ? options.indexOf(selected)
      : options.findIndex(option => !option.disabled)

    this._keyManager.setActiveItem(index)
  }

  private _scrollTo(option: CkOption | undefined): void {
    const panel = this._panel()

    if (!option || !panel) return

    const top = getScrollPosition(
      option.host.nativeElement,
      panel.nativeElement,
    )

    panel.nativeElement.scrollTo({ top })
  }

  private _getOverlayPositions(position: SelectPosition): ConnectedPosition[] {
    const offsetY = 4

    const below: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY,
        panelClass: 'ck-position-below',
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY,
        panelClass: 'ck-position-below',
      },
    ]

    const above: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -offsetY,
        panelClass: 'ck-position-above',
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -offsetY,
        panelClass: 'ck-position-above',
      },
    ]

    const positions = { above, below, auto: [...below, ...above] }

    return positions[position]
  }

  private _widthChanges(): Observable<number> {
    if (!isPlatformBrowser(this._platformId)) return EMPTY

    return new Observable(subscriber => {
      const resizeObserver = new ResizeObserver(entries => {
        const [width] = entries.map(
          ({ borderBoxSize: [{ inlineSize }] }) => inlineSize,
        )

        return subscriber.next(width)
      })

      resizeObserver.observe(this.host.nativeElement)

      return function unsubscribe() {
        resizeObserver.disconnect()
      }
    })
  }

  private _isOpeningKeydownEvent(event: KeyboardEvent): boolean {
    const { keyCode } = event

    const isArrow = keyCode === UP_ARROW || keyCode === DOWN_ARROW
    const isSelectionKey = keyCode === ENTER || keyCode === SPACE

    return (
      ((isArrow || isSelectionKey) && !hasModifierKey(event)) ||
      (isArrow && hasModifierKey(event, 'altKey'))
    )
  }

  private _isClosingKeydownEvent(event: KeyboardEvent): boolean {
    return (
      (event.keyCode === TAB && !hasModifierKey(event, 'ctrlKey')) ||
      (event.keyCode === ESCAPE && !hasModifierKey(event)) ||
      (event.keyCode === UP_ARROW && hasModifierKey(event, 'altKey'))
    )
  }

  private _isSelectionKeydownEvent(event: KeyboardEvent): boolean {
    if (hasModifierKey(event)) return false
    if (event.keyCode === ENTER) return true

    // Space is a part of the search query while typeahead is in progress.
    return event.keyCode === SPACE && !this._keyManager.isTyping()
  }

  /**
   * Runs when an option's selection state is toggled by the user.
   *
   * Sets the value and closes the dropdown.
   */
  private _selectionChangeEffect(): void {
    const selectionChange = this._selectionChange()

    if (!selectionChange) return

    untracked(() => this._handleUserSelection(selectionChange.source))
  }

  private _handleUserSelection(option: CkOption): void {
    // Deselection is not supported: clicking the selected option again only
    // closes the dropdown keeping the value intact.
    // TODO: https://github.com/corekit-ui/corekit-ui/issues/42
    if (!option.isSelected()) {
      option.select(false)

      return this.close()
    }

    this.options().forEach(other => other !== option && other.deselect(false))

    this._setValue(option.value())
    this.close()
  }

  /**
   * Runs when options or the value change.
   *
   * Reflects the value to the selection state of the options. Handles
   * asynchronously rendered options and options recreated by `@for()`.
   */
  private _syncSelectionEffect(): void {
    this.options()
    this._value()
    this.compareWith()

    untracked(() => {
      const value = this._value()
      const compare = this.compareWith()

      this.options().forEach(option => {
        // `null` is matched like any other value, so that an explicit
        // "nothing selected" option can be offered in the list. When no option
        // holds the current value, nothing is selected and the trigger falls
        // back to the placeholder.
        if (compare(option.value(), value)) {
          option.select(false)
        } else {
          option.deselect(false)
        }
      })
    })
  }

  /**
   * Runs when active option changes.
   *
   * Scrolls the active option into view.
   */
  private _scrollToActiveOptionEffect(): void {
    const option = this.activeOption()

    untracked(() => this._scrollTo(option))
  }

  /**
   * Runs when {@link _hostWidth `_hostWidth`} changes.
   *
   * Updates dropdown width to match the trigger width.
   */
  private _hostWidthChangeEffect(): void {
    this._overlayRef()?.updateSize({ width: this._hostWidth() })
  }

  /**
   * Runs when dropdown opened status and user commanded {@link position}
   * changes.
   *
   * Updates dropdown position.
   */
  private _positionChangeEffect(): void {
    if (this.isOpen()) this.updatePosition(this.position())
  }

  /**
   * Runs when user clicks the label of the enclosing form field.
   *
   * Focuses the trigger the same way a native control would be focused.
   */
  private _labelClickEffect(): void {
    if (!this._labelClick()) return

    untracked(() => !this.disabled() && this.host.nativeElement.focus())
  }

  /**
   * Runs when user clicks outside the trigger and dropdown area.
   *
   * Closes the dropdown and marks the control as touched.
   */
  private _outsideClickEffect(): void {
    if (!this._outsideClick()) return

    untracked(() => {
      if (!this.isOpen()) return

      this._onTouched()
      this.close()
    })
  }
}
