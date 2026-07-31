import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core'
import {
  calendarHeaderButtonStyles,
  calendarHeaderLabelStyles,
  calendarHeaderStyles,
} from './calendar-header.styles'

/**
 * Calendar header with a current period label and navigation buttons.
 */
@Component({
  selector: 'ck-calendar-header',
  exportAs: 'ckCalendarHeader',
  templateUrl: './calendar-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '_class' },
})
export class CkCalendarHeader {
  /** Label of the currently displayed period, e.g. `July 2026`. */
  public readonly label = input.required<string>()

  /** Accessible label of the previous period button. */
  public readonly previousButtonLabel = input('Go to the previous month')

  /** Accessible label of the next period button. */
  public readonly nextButtonLabel = input('Go to the next month')

  /** Accessible label of the period button. */
  public readonly periodButtonLabel = input('Choose month and year')

  /** Whether the previous period button is disabled. */
  public readonly previousDisabled = input(false)

  /** Whether the next period button is disabled. */
  public readonly nextDisabled = input(false)

  /** Event emitted when the previous period button is clicked. */
  public readonly previous = output()

  /** Event emitted when the next period button is clicked. */
  public readonly next = output()

  /** Event emitted when the period label button is clicked. */
  public readonly periodClicked = output()

  protected readonly _class = calendarHeaderStyles
  protected readonly _buttonClass = calendarHeaderButtonStyles
  protected readonly _labelClass = calendarHeaderLabelStyles
}
