import { inject, InjectionToken, LOCALE_ID } from '@angular/core'

/**
 * Locale used by date-aware components and `CkDateAdapter` implementations.
 *
 * Defaults to the application-wide `LOCALE_ID`.
 */
export const CK_DATE_LOCALE = new InjectionToken<string>('CK_DATE_LOCALE', {
  providedIn: 'root',
  factory: (): string => inject(LOCALE_ID),
})
