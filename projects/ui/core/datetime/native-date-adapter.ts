import { inject, Injectable } from '@angular/core'

import { CkDateAdapter, CkDateNameStyle } from './date-adapter'
import { CK_DATE_LOCALE } from './date-locale'

/** Matches strings that have the form of a valid ISO 8601 string. */
const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/u

/** Matches an ISO 8601 string carrying a date without a time. */
const ISO_8601_DATE_REGEX = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/u

/** Creates an array of the given length filled by the value factory. */
function range<T>(length: number, valueFactory: (index: number) => T): T[] {
  return Array.from({ length }, (_, index) => valueFactory(index))
}

/** `CkDateAdapter` implementation based on the native JavaScript `Date`. */
@Injectable({ providedIn: 'root' })
export class CkNativeDateAdapter extends CkDateAdapter<Date> {
  private readonly _locale = inject(CK_DATE_LOCALE)

  public getYear(date: Date): number {
    return date.getFullYear()
  }

  public getMonth(date: Date): number {
    return date.getMonth()
  }

  public getDate(date: Date): number {
    return date.getDate()
  }

  public getDayOfWeek(date: Date): number {
    return date.getDay()
  }

  public getMonthNames(style: CkDateNameStyle): string[] {
    const format = new Intl.DateTimeFormat(this._locale, {
      month: style,
      timeZone: 'utc',
    })

    return range(12, month => {
      return format.format(new Date(Date.UTC(2017, month, 1)))
    })
  }

  public getDateNames(): string[] {
    const format = new Intl.DateTimeFormat(this._locale, {
      day: 'numeric',
      timeZone: 'utc',
    })

    return range(31, date =>
      format.format(new Date(Date.UTC(2017, 0, date + 1))),
    )
  }

  public getDayOfWeekNames(style: CkDateNameStyle): string[] {
    const format = new Intl.DateTimeFormat(this._locale, {
      weekday: style,
      timeZone: 'utc',
    })

    // January 1st, 2017 was a Sunday.
    return range(7, day => format.format(new Date(Date.UTC(2017, 0, day + 1))))
  }

  public getYearName(date: Date): string {
    const format = new Intl.DateTimeFormat(this._locale, {
      year: 'numeric',
      timeZone: 'utc',
    })

    return format.format(this._toUtcDate(date))
  }

  public getFirstDayOfWeek(): number {
    const locale = new Intl.Locale(this._locale) as Intl.Locale & {
      getWeekInfo?(): { firstDay: number }
      weekInfo?: { firstDay: number }
    }

    // Some browsers implement a `getWeekInfo` method while others have a
    // `weekInfo` getter, and some support neither.
    const firstDay = (locale.getWeekInfo?.() ?? locale.weekInfo)?.firstDay ?? 0

    // `firstDay` is 1-based where 1 is Monday and 7 is Sunday, whereas our
    // representation is 0-based starting from Sunday.
    return firstDay % 7
  }

  public getNumDaysInMonth(date: Date): number {
    return this.getDate(
      this._createDateWithOverflow(
        this.getYear(date),
        this.getMonth(date) + 1,
        0,
      ),
    )
  }

  public createDate(year: number, month: number, date: number): Date {
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`,
      )
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`)
    }

    const result = this._createDateWithOverflow(year, month, date)

    if (result.getMonth() !== month) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`)
    }

    return result
  }

  public today(): Date {
    return new Date()
  }

  /**
   * Parses a date from a user-provided value.
   *
   * The native `Date` has no way to customize the parse format or locale, so
   * `parseFormat` is ignored and parsing is delegated to `Date.parse`.
   */
  public parse(value: unknown): Date | null {
    if (typeof value === 'number') return new Date(value)

    return value ? new Date(Date.parse(value as string)) : null
  }

  public format(date: Date, displayFormat: Intl.DateTimeFormatOptions): string {
    if (!this.isValid(date)) {
      throw Error('CkNativeDateAdapter: Cannot format invalid date.')
    }

    const format = new Intl.DateTimeFormat(this._locale, {
      ...displayFormat,
      timeZone: 'utc',
    })

    return format.format(this._toUtcDate(date))
  }

  public addCalendarYears(date: Date, years: number): Date {
    return this.addCalendarMonths(date, years * 12)
  }

  public addCalendarMonths(date: Date, months: number): Date {
    let newDate = this._createDateWithOverflow(
      this.getYear(date),
      this.getMonth(date) + months,
      this.getDate(date),
    )

    // It's possible to wind up in the wrong month if the original month has
    // more days than the new month. In this case we want to go to the last day
    // of the desired month.
    if (
      this.getMonth(newDate) !==
      (((this.getMonth(date) + months) % 12) + 12) % 12
    ) {
      newDate = this._createDateWithOverflow(
        this.getYear(newDate),
        this.getMonth(newDate),
        0,
      )
    }

    return newDate
  }

  public addCalendarDays(date: Date, days: number): Date {
    return this._createDateWithOverflow(
      this.getYear(date),
      this.getMonth(date),
      this.getDate(date) + days,
    )
  }

  public isDateInstance(value: unknown): value is Date {
    return value instanceof Date
  }

  public isValid(date: Date): boolean {
    return !isNaN(date.getTime())
  }

  public invalid(): Date {
    return new Date(NaN)
  }

  /**
   * Converts a value into a date, accepting ISO 8601 strings.
   *
   * Unlike the plain `Date` constructor, a string without a time is read as a
   * local calendar day rather than UTC midnight — see {@link _parseIsoDate}.
   */
  public override deserialize(value: unknown): Date | null {
    if (typeof value === 'string') {
      if (!value) return null

      const localDate = this._parseIsoDate(value)

      if (localDate) return localDate

      // The `Date` constructor accepts formats other than ISO 8601, so we only
      // pass it values that strictly look like ISO strings to avoid deserializing
      // arbitrary garbage.
      if (ISO_8601_REGEX.test(value)) {
        const date = new Date(value)

        if (this.isValid(date)) return date
      }
    }

    return super.deserialize(value)
  }

  /**
   * Reads a time-less ISO 8601 string as a local date.
   *
   * The `Date` constructor treats such strings as UTC midnight, which lands on
   * the previous day in negative offset timezones. A calendar day carries no
   * timezone, so it's kept as typed.
   *
   * @returns The date, or `null` if the string isn't a time-less ISO 8601 one.
   */
  private _parseIsoDate(value: string): Date | null {
    const groups = ISO_8601_DATE_REGEX.exec(value)?.groups

    if (!groups) return null

    const year = Number(groups['year'])
    const month = Number(groups['month']) - 1
    const day = Number(groups['day'])
    const date = this._createDateWithOverflow(year, month, day)

    // Rejects values like `2026-13-45`, which would silently overflow into
    // another month.
    const isExactDate =
      this.getYear(date) === year &&
      this.getMonth(date) === month &&
      this.getDate(date) === day

    return isExactDate ? date : null
  }

  /**
   * Creates a date, allowing out-of-range values to overflow into the adjacent
   * months/years, e.g. month `12` becomes January of the next year.
   */
  private _createDateWithOverflow(
    year: number,
    month: number,
    date: number,
  ): Date {
    const result = new Date()

    result.setFullYear(year, month, date)
    result.setHours(0, 0, 0, 0)

    return result
  }

  /**
   * Returns a copy of the date shifted so its local values become UTC values.
   * Used before formatting with a UTC-based `Intl.DateTimeFormat`, which
   * prevents the formatted value from drifting a day around DST changes.
   */
  private _toUtcDate(date: Date): Date {
    const utcDate = new Date()

    utcDate.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate())
    utcDate.setUTCHours(0, 0, 0, 0)

    return utcDate
  }
}
