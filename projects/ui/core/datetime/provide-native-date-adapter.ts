import { Provider } from '@angular/core'

import { CkDateAdapter } from './date-adapter'
import { CkDateFormats, CK_DATE_FORMATS } from './date-formats'
import { CkNativeDateAdapter } from './native-date-adapter'
import { CK_NATIVE_DATE_FORMATS } from './native-date-formats'

/**
 * Configures date-aware components to work with the native JavaScript `Date`.
 *
 * @param formats Date formats to use instead of the default
 * {@link CK_NATIVE_DATE_FORMATS `CK_NATIVE_DATE_FORMATS`}.
 */
export function provideNativeDateAdapter(
  formats: CkDateFormats = CK_NATIVE_DATE_FORMATS,
): Provider[] {
  return [
    { provide: CkDateAdapter, useClass: CkNativeDateAdapter },
    { provide: CK_DATE_FORMATS, useValue: formats },
  ]
}
