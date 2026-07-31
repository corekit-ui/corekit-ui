import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { CkDateNameStyle } from '@corekit/ui/core'
import { classNames } from '@corekit/ui/utils'
import { CkCalendarCell } from './calendar-cell'
import { CkCalendarViewBase } from './calendar-view'
import { calendarViewCellStyles } from './calendar-view.styles'
import {
  monthViewCellStyles,
  monthViewDayStyles,
  monthViewStyles,
  monthViewTableStyles,
  monthViewWeekdayStyles,
  monthViewWeekRowStyles,
} from './month-view.styles'

/** Weekday to be rendered in the month view header row. */
type Weekday = {
  /** Full name announced by screen readers, e.g. `Sunday`. */
  long: string

  /** Name rendered in the row, e.g. `Sun`. */
  display: string
}

/** Day cell of the month view grid. */
type DayCell<D> = CkCalendarCell<D> & {
  /** Whether the day is currently selected. */
  isSelected: boolean

  /** Whether the day cannot be selected. */
  isDisabled: boolean

  /**
   * Whether the day is the tab stop of the grid. Only one cell is active at a
   * time — the roving tabindex pattern.
   */
  isActive: boolean

  /** CSS classes of the day button, resolved from the cell's state. */
  class: string
}

/** Month view of the calendar displaying a grid of days. */
@Component({
  selector: 'ck-month-view',
  exportAs: 'ckMonthView',
  templateUrl: './month-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '_class' },
})
export class CkMonthView<D> extends CkCalendarViewBase<D> {
  /** Style of the weekday names in the header row. */
  public readonly weekdayStyle = input<CkDateNameStyle>('short')

  /**
   * Weekday names in render order, starting from the adapter's first day of
   * the week.
   */
  protected readonly _weekdays = computed<Weekday[]>(() => {
    const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek()
    const longNames = this._dateAdapter.getDayOfWeekNames('long')
    const displayNames = this._dateAdapter.getDayOfWeekNames(
      this.weekdayStyle(),
    )

    return Array.from({ length: 7 }, (_, index) => {
      const day = (firstDayOfWeek + index) % 7

      return { long: longNames[day], display: displayNames[day] }
    })
  })

  /**
   * Cells of the displayed month split into weeks. Cells outside of the month
   * are `null` and rendered blank.
   */
  protected readonly _weeks = computed<Array<Array<DayCell<D> | null>>>(() => {
    const activeDate = this.activeDate()
    const year = this._dateAdapter.getYear(activeDate)
    const month = this._dateAdapter.getMonth(activeDate)
    const numDays = this._dateAdapter.getNumDaysInMonth(activeDate)
    const today = this._dateAdapter.today()
    const selected = this.selected()
    const firstWeekOffset = this._weekOffset(
      this._dateAdapter.createDate(year, month, 1),
    )

    const totalCells = Math.ceil((firstWeekOffset + numDays) / 7) * 7

    const cells = Array.from({ length: totalCells }, (_, index) => {
      const day = index - firstWeekOffset + 1

      if (day < 1 || day > numDays) return null

      return this._createCell(
        this._dateAdapter.createDate(year, month, day),
        today,
        selected,
        activeDate,
      )
    })

    return Array.from({ length: totalCells / 7 }, (_, week) => {
      return cells.slice(week * 7, week * 7 + 7)
    })
  })

  protected readonly _class = monthViewStyles
  protected readonly _tableClass = monthViewTableStyles
  protected readonly _weekRowClass = monthViewWeekRowStyles
  protected readonly _weekdayClass = monthViewWeekdayStyles
  protected readonly _cellClass = monthViewCellStyles

  /** Emits the date of the clicked cell unless it's disabled or selected. */
  protected _selectCell(cell: DayCell<D>): void {
    this._selectDate(cell.value, cell.isDisabled)
  }

  protected _selectActiveDate(): void {
    const activeDate = this.activeDate()

    this._selectDate(activeDate, !this._isDateEnabled(activeDate))
  }

  protected _dateFromKeyCode(keyCode: number): D | null {
    const activeDate = this.activeDate()
    const year = this._dateAdapter.getYear(activeDate)
    const month = this._dateAdapter.getMonth(activeDate)

    switch (keyCode) {
      case LEFT_ARROW:
        return this._dateAdapter.addCalendarDays(activeDate, -1)

      case RIGHT_ARROW:
        return this._dateAdapter.addCalendarDays(activeDate, 1)

      case UP_ARROW:
        return this._dateAdapter.addCalendarDays(activeDate, -7)

      case DOWN_ARROW:
        return this._dateAdapter.addCalendarDays(activeDate, 7)

      case HOME:
        return this._dateAdapter.createDate(year, month, 1)

      case END:
        return this._dateAdapter.createDate(
          year,
          month,
          this._dateAdapter.getNumDaysInMonth(activeDate),
        )

      case PAGE_UP:
        return this._dateAdapter.addCalendarMonths(activeDate, -1)

      case PAGE_DOWN:
        return this._dateAdapter.addCalendarMonths(activeDate, 1)

      default:
        return null
    }
  }

  /**
   * Emits the date unless it's disabled.
   *
   * Picking the already selected date emits too, so that consumers can react
   * to the user's action itself, e.g. close a popup.
   */
  private _selectDate(date: D, isDisabled: boolean): void {
    if (isDisabled) return

    this.selectedChange.emit(date)
  }

  /** Whether the date is within `min`/`max` and passes the `dateFilter`. */
  private _isDateEnabled(date: D): boolean {
    const min = this._min()
    const max = this._max()

    return (
      (!min || this._dateAdapter.compareDate(date, min) >= 0) &&
      (!max || this._dateAdapter.compareDate(date, max) <= 0) &&
      (this.dateFilter()?.(date) ?? true)
    )
  }

  /** Number of cells the given date is offset from the start of its week. */
  private _weekOffset(date: D): number {
    return (
      (7 +
        this._dateAdapter.getDayOfWeek(date) -
        this._dateAdapter.getFirstDayOfWeek()) %
      7
    )
  }

  private _createCell(
    date: D,
    today: D,
    selected: D | null,
    activeDate: D,
  ): DayCell<D> {
    const isSelected = this._dateAdapter.sameDate(date, selected)
    const isToday = this._dateAdapter.sameDate(date, today)
    const isDisabled = !this._isDateEnabled(date)

    // Selection has priority over the today highlight.
    const state = isSelected ? 'selected' : isToday ? 'today' : 'default'

    return {
      value: date,
      displayValue:
        this._dateAdapter.getDateNames()[this._dateAdapter.getDate(date) - 1],
      ariaLabel: this._dateAdapter.format(
        date,
        this._dateFormats.display.dateA11yLabel,
      ),
      isSelected,
      isDisabled,
      isActive: this._dateAdapter.sameDate(date, activeDate),
      class: classNames(
        calendarViewCellStyles({ state, disabled: isDisabled }),
        monthViewDayStyles,
      ),
    }
  }
}
