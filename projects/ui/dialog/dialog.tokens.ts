import { InjectionToken } from '@angular/core'
import { CkDialogConfig } from './dialog-config'

/** DI token that is used to specify default dialog config. */
export const CK_DIALOG_DEFAULT_CONFIG = new InjectionToken<CkDialogConfig>(
  'CK_DIALOG_DEFAULT_CONFIG'
)

/**
 * DI token which allows injecting the Dialog data passed with config on its'
 * opening.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CK_DIALOG_DATA = new InjectionToken<any>('CK_DIALOG_DATA')
