import { _IdGenerator, CdkTrapFocus } from '@angular/cdk/a11y'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core'
import { CkDateNameStyle } from '@corekit/ui/core'
import { classNames } from '@corekit/ui/utils'
import { Subject } from 'rxjs'
import { CkCalendar, CkCalendarView } from './calendar'
import {
  CK_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
  CkDateSelectionModel,
} from './date-selection-model'
import { CkDatepickerInput } from './datepicker-input'
import { datepickerPanelStyles } from './datepicker.styles'

/** Datepicker popup panel. */
@Component({
  selector: 'ck-datepicker',
  exportAs: 'ckDatepicker',
  imports: [CdkTrapFocus, CkCalendar],
  templateUrl: './datepicker.html',
  providers: [CK_SINGLE_DATE_SELECTION_MODEL_PROVIDER],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hidden' },
})
export class CkDatepicker<D> {
  /**
   * The date the calendar is opened at. Defaults to the selected date or
   * today.
   */
  public readonly startAt = input<D | null>(null)

  /** The view the calendar is opened at. */
  public readonly startView = input<CkCalendarView>('month')

  /** Style of the weekday names in the month view header row. */
  public readonly weekdayStyle = input<CkDateNameStyle>('short')

  /** Whether the datepicker is disabled on its own. */
  public readonly disabled = input(false, { transform: booleanAttribute })

  /** Unique ID of the popup panel. */
  public readonly id = inject(_IdGenerator).getId('ck-datepicker-')

  /** Whether the popup is open. */
  public readonly isOpen = computed(() => this._isOpen())

  /**
   * Whether the datepicker cannot be opened — either it is disabled itself or
   * its input is.
   */
  public readonly isDisabled = computed(() => {
    return this.disabled() || (this._input()?.isDisabled() ?? false)
  })

  /**
   * Stream of closing animation completion events. The popup stays attached
   * until the animation ends.
   */
  public readonly exitAnimationEnd = new Subject<void>()

  /** Reference to the template of the panel. */
  public readonly _template =
    viewChild.required<TemplateRef<unknown>>('template')

  /** Selection state shared with the connected input. */
  public readonly _model =
    inject<CkDateSelectionModel<D | null, D>>(CkDateSelectionModel)

  /** Input connected to this datepicker. */
  public readonly _input = signal<CkDatepickerInput<D> | null>(null)

  /**
   * Toggle button element connected to this datepicker. The input must not
   * treat its clicks as outside clicks.
   */
  public readonly _toggle = signal<ElementRef<HTMLElement> | null>(null)

  /** The currently selected date. */
  protected readonly _selected = computed(() => this._model.selection())

  /** The date the calendar opens at, falling back to the selected one. */
  protected readonly _startAt = computed(() => {
    return this.startAt() ?? this._selected()
  })

  // Boundaries and the filter belong to the input, as they also drive its
  // validation.
  protected readonly _min = computed(() => this._input()?.min() ?? null)
  protected readonly _max = computed(() => this._input()?.max() ?? null)

  protected readonly _dateFilter = computed(() => {
    return this._input()?.dateFilter() ?? null
  })

  protected readonly _class = computed(() => {
    return classNames(
      datepickerPanelStyles({ state: this._isOpen() ? 'open' : 'closed' }),
    )
  })

  private readonly _isOpen = signal(false)

  /** Opens the popup. Requires a connected input. */
  public open(): void {
    this._input()?.open()
  }

  /** Closes the popup. */
  public close(): void {
    this._input()?.close()
  }

  public _registerInput(datepickerInput: CkDatepickerInput<D> | null): void {
    this._input.set(datepickerInput)
  }

  public _registerToggle(toggle: ElementRef<HTMLElement> | null): void {
    this._toggle.set(toggle)
  }

  public _open(): void {
    this._isOpen.set(true)
  }

  public _close(): void {
    this._isOpen.set(false)
  }

  /**
   * Writes the picked date to the selection and closes the popup once the
   * selection is complete.
   */
  protected _dateSelected(date: D): void {
    this._model.add(date, this)

    if (this._model.isComplete()) this.close()
  }

  protected _animationEnd(event: AnimationEvent): void {
    if (event.animationName === 'exit') this.exitAnimationEnd.next()
  }
}
