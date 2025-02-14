import { InjectionToken } from '@angular/core'

/** A component which can be closed. */
export interface CkClosable<R = unknown> {
  /**
   * Closes the component.
   *
   * @param result Data to be emitted to the component opener when the component
   * closes.
   */
  close(result?: R): void
}

/** DI Token used to provide specific `CkClosable` implementation. */
export const CK_CLOSABLE = new InjectionToken<CkClosable>('CK_CLOSABLE')
