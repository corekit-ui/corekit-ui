import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay'
import { Directionality } from '@angular/cdk/bidi'
import { DOWN_ARROW, ESCAPE, hasModifierKey } from '@angular/cdk/keycodes'
import {
  _getEventTarget,
  _getFocusedElementPierceShadowDom,
} from '@angular/cdk/platform'
import { TemplatePortal } from '@angular/cdk/portal'
import { DOCUMENT } from '@angular/common'
import {
  afterNextRender,
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  untracked,
  ViewContainerRef,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms'
import { CK_DATE_FORMATS, CkDateAdapter } from '@corekit/ui/core'
import {
  CkDateSelectionChange,
  CkDateSelectionModel,
} from './date-selection-model'
import {
  dateFilterValidator,
  maxDateValidator,
  minDateValidator,
  parseDateValidator,
} from './datepicker-validators'
import { CkDatepicker } from './datepicker'
import { CK_DATEPICKER_SCROLL_STRATEGY } from './scroll-strategy.token'

const CONTROL_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CkDatepickerInput),
  multi: true,
}

const VALIDATOR_PROVIDER = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CkDatepickerInput),
  multi: true,
}

/**
 * Directive connecting an input to a datepicker popup.
 *
 * The input is for manual typing — the popup is opened with the
 * `CkDatepickerToggle` button or programmatically, and is anchored to this
 * input.
 */
@Directive({
  selector: 'input[ckDatepicker]',
  exportAs: 'ckDatepickerInput',
  providers: [CONTROL_VALUE_ACCESSOR_PROVIDER, VALIDATOR_PROVIDER],
  host: {
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'datepicker().isOpen()',
    '[attr.aria-controls]': 'datepicker().isOpen() ? datepicker().id : null',
    '[disabled]': 'isDisabled()',
    '(input)': '_handleInput($event)',
    '(change)': '_handleChange()',
    '(blur)': '_handleBlur()',
    '(keydown)': '_handleKeydown($event)',
  },
})
export class CkDatepickerInput<D>
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  /** The datepicker this input should control. */
  public readonly datepicker = input.required<CkDatepicker<D>>({
    alias: 'ckDatepicker',
  })

  /** The minimum selectable date. */
  public readonly min = input<D | null>(null)

  /** The maximum selectable date. */
  public readonly max = input<D | null>(null)

  /** Function disabling arbitrary dates, e.g. weekends. */
  public readonly dateFilter = input<((date: D) => boolean) | null>(null, {
    alias: 'ckDatepickerFilter',
  })

  /** Whether the input is disabled. */
  public readonly disabled = input(false, { transform: booleanAttribute })

  /** Event emitted every time the typed value is parsed into a date. */
  public readonly dateInput = output<D | null>()

  /**
   * Event emitted when the value is committed — a date is picked in the
   * calendar or the typed value fires a native `change` event.
   */
  public readonly dateChange = output<D | null>()

  /** The currently selected date. */
  public readonly value = computed(() => this._model()?.selection() ?? null)

  /** Whether the input is disabled by the binding or by its form control. */
  public readonly isDisabled = computed(() => {
    return this.disabled() || this._isDisabledByForm()
  })

  /**
   * Whether the typed value could be parsed into a date. Consumed by the
   * parse validator.
   */
  public readonly isParseValid = computed(() => this._isParseValid())

  /** HTML Element of the input. */
  public readonly host = inject<ElementRef<HTMLInputElement>>(ElementRef)

  private readonly _dateAdapter = inject<CkDateAdapter<D>>(CkDateAdapter)
  private readonly _dateFormats = inject(CK_DATE_FORMATS)
  private readonly _overlay = inject(Overlay)
  private readonly _viewContainerRef = inject(ViewContainerRef)
  private readonly _destroyRef = inject(DestroyRef)
  private readonly _injector = inject(Injector)
  private readonly _document = inject(DOCUMENT)
  private readonly _directionality = inject(Directionality)

  private readonly _scrollStrategyFactory = inject(
    CK_DATEPICKER_SCROLL_STRATEGY,
  )

  /**
   * Selection state shared with the datepicker. Only available once the
   * datepicker input is resolved, hence the signal.
   */
  private readonly _model = signal<CkDateSelectionModel<D | null, D> | null>(
    null,
  )

  private readonly _isParseValid = signal(true)
  private readonly _isDisabledByForm = signal(false)

  private readonly _validator = Validators.compose([
    parseDateValidator(this._isParseValid, () => this.host.nativeElement.value),
    minDateValidator(this._dateAdapter, () => this.min()),
    maxDateValidator(this._dateAdapter, () => this.max()),
    dateFilterValidator(this._dateAdapter, () => this.dateFilter()),
  ])

  /**
   * Value written by the form before the model was available. Applied as soon
   * as it is.
   */
  private _pendingValue: D | null = null
  private _hasPendingValue = false

  private _overlayRef: OverlayRef | null = null
  private _portal: TemplatePortal | null = null

  /** Element focused before the popup opened, to be focused back on close. */
  private _focusedElementBeforeOpen: HTMLElement | null = null

  constructor() {
    // Validity depends on state the form cannot see, so the control has to be
    // told to re-run the validators when it changes.
    effect(() => {
      this.min()
      this.max()
      this.dateFilter()
      this._isParseValid()

      untracked(() => this._onValidatorChange())
    })
  }

  public ngOnInit(): void {
    const datepicker = this.datepicker()

    datepicker._registerInput(this)
    this._model.set(datepicker._model)

    datepicker._model.selectionChanged
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(change => this._selectionChanged(change))

    // The popup is detached only after it finishes animating out.
    datepicker.exitAnimationEnd
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._overlayRef?.detach()
      })

    if (this._hasPendingValue) {
      this._hasPendingValue = false
      this._assignValue(this._pendingValue)
    }
  }

  public ngOnDestroy(): void {
    this.datepicker()._registerInput(null)
    this._overlayRef?.dispose()
  }

  public writeValue(value: unknown): void {
    this._assignValue(this._deserialize(value))
  }

  public registerOnChange(onChange: (value: D | null) => void): void {
    this._onChange = onChange
  }

  public registerOnTouched(onTouched: () => void): void {
    this._onTouched = onTouched
  }

  public setDisabledState(disabled: boolean): void {
    this._isDisabledByForm.set(disabled)
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    return this._validator?.(control) ?? null
  }

  public registerOnValidatorChange(onValidatorChange: () => void): void {
    this._onValidatorChange = onValidatorChange
  }

  /** Opens the datepicker popup. */
  public open(): void {
    if (this.datepicker().isOpen() || this.datepicker().isDisabled()) return

    const overlayRef = this._overlayRef ?? this._createOverlay()

    this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom()

    // Mark as open before attaching so that the panel renders with the
    // entering animation instead of the exiting one.
    this.datepicker()._open()

    if (!overlayRef.hasAttached()) {
      this._portal ??= new TemplatePortal(
        this.datepicker()._template(),
        this._viewContainerRef,
      )

      overlayRef.attach(this._portal)
    }

    this._focusActiveCellAfterRender()
  }

  /** Closes the datepicker popup. */
  public close(): void {
    if (!this.datepicker().isOpen()) return

    this.datepicker()._close()
    this._restoreFocus()
  }

  /** Sets form control value. Assigned via `ControlValueAccessor`. */
  protected _onChange: (value: D | null) => void = () => null

  /** Marks form control as touched. Assigned via `ControlValueAccessor`. */
  protected _onTouched: () => void = () => null

  /** Re-runs the validators. Assigned via `Validator`. */
  protected _onValidatorChange: () => void = () => null

  /** Parses the typed value and puts it into the selection. */
  protected _handleInput(event: Event): void {
    const text = _getEventTarget<HTMLInputElement>(event)?.value ?? ''
    const parsed = this._dateAdapter.parse(
      text,
      this._dateFormats.parse.dateInput,
    )

    // An empty field is not a parse error, a value that isn't a date is.
    this._isParseValid.set(!parsed || this._dateAdapter.isValid(parsed))

    const date = this._dateAdapter.getValidDateOrNull(parsed)
    const hasChanged = !this._dateAdapter.sameDate(date, this.value())

    // Every null is reported to the form, even when the value stays null:
    // typing an unparsable date doesn't change the value, but it does change
    // the validity, and validators only re-run on a value report.
    if (!date || hasChanged) this._onChange(date)

    if (!hasChanged) return

    this._model()?.updateSelection(date, this)
    this.dateInput.emit(date)
  }

  /** Commits the typed value, mirroring the native `change` event. */
  protected _handleChange(): void {
    this.dateChange.emit(this.value())
  }

  protected _handleBlur(): void {
    // Bring a partially typed value back to the display format.
    if (this.value()) this._formatValue(this.value())

    this._onTouched()
  }

  /** Opens the popup on Alt + Down Arrow, the shortcut of a native picker. */
  protected _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode !== DOWN_ARROW || !hasModifierKey(event, 'altKey')) return

    this.open()
    event.preventDefault()
  }

  /** Focuses the active day of the calendar once the popup is rendered. */
  private _focusActiveCellAfterRender(): void {
    afterNextRender(
      {
        read: () => {
          this._overlayRef?.overlayElement
            .querySelector<HTMLButtonElement>('button[data-active]')
            ?.focus()
        },
      },
      { injector: this._injector },
    )
  }

  /**
   * Focuses the element that was focused before opening, but only if focus is
   * still inside the popup — closing by clicking elsewhere must not steal it.
   */
  private _restoreFocus(): void {
    const isFocusInsidePopup = this._overlayRef?.overlayElement.contains(
      this._document.activeElement,
    )

    if (isFocusInsidePopup) this._focusRestoreTarget().focus()

    this._focusedElementBeforeOpen = null
  }

  private _focusRestoreTarget(): HTMLElement {
    const previous = this._focusedElementBeforeOpen

    // Safari doesn't focus buttons on click, so the element focused before
    // opening can be the body — send the focus to the input instead of
    // dropping it.
    return previous && previous !== this._document.body
      ? previous
      : this.host.nativeElement
  }

  /** Puts the date into the selection, deferring until the model exists. */
  private _assignValue(date: D | null): void {
    const model = this._model()

    if (!model) {
      this._pendingValue = date
      this._hasPendingValue = true

      return
    }

    model.updateSelection(date, this)
    this._formatValue(date)
  }

  /**
   * Converts a value coming from a form control into a date, keeping track of
   * whether it was usable at all.
   */
  private _deserialize(value: unknown): D | null {
    const date = this._dateAdapter.deserialize(value)

    this._isParseValid.set(!date || this._dateAdapter.isValid(date))

    return this._dateAdapter.getValidDateOrNull(date)
  }

  /**
   * Reflects a selection change made elsewhere, e.g. in the calendar: renders
   * the date and notifies both the form and the consumer.
   */
  private _selectionChanged({
    selection,
    oldValue,
    source,
  }: CkDateSelectionChange<D | null>): void {
    if (source === this) return

    this._isParseValid.set(true)
    this._formatValue(selection)
    this._onChange(selection)
    this._onTouched()

    if (!this._dateAdapter.sameDate(selection, oldValue)) {
      this.dateInput.emit(selection)
      this.dateChange.emit(selection)
    }
  }

  /** Renders the date in the input using the display format. */
  private _formatValue(date: D | null): void {
    this.host.nativeElement.value = date
      ? this._dateAdapter.format(date, this._dateFormats.display.dateInput)
      : ''
  }

  private _createOverlay(): OverlayRef {
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions(this._getOverlayPositions())
      .withPush(false)
      .withFlexibleDimensions(false)
      .withViewportMargin(6)

    this._overlayRef = this._overlay.create(
      new OverlayConfig({
        positionStrategy,
        scrollStrategy: this._scrollStrategyFactory(),
        // Makes the `start`/`end` positions follow the layout direction.
        direction: this._directionality,
      }),
    )

    this._overlayRef.outsidePointerEvents().subscribe(event => {
      const target = _getEventTarget<HTMLElement>(event)

      const isInside =
        this.host.nativeElement.contains(target) ||
        this.datepicker()._toggle()?.nativeElement.contains(target)

      if (!isInside) this.close()
    })

    this._overlayRef.keydownEvents().subscribe(event => {
      if (event.keyCode !== ESCAPE || hasModifierKey(event)) return

      event.preventDefault()
      this.close()
    })

    return this._overlayRef
  }

  private _getOverlayPositions(): ConnectedPosition[] {
    const offsetY = 4

    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY,
        panelClass: 'ck-position-below',
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -offsetY,
        panelClass: 'ck-position-above',
      },
    ]
  }
}
