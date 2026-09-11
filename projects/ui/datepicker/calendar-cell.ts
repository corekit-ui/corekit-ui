/** Single cell of a calendar view grid, e.g. a day or a month. */
export type CkCalendarCell<V> = {
  /** Value represented by the cell. */
  value: V

  /** Text rendered in the cell, e.g. `15`. */
  displayValue: string

  /** Full description announced by screen readers, e.g. `July 15, 2026`. */
  ariaLabel: string
}
