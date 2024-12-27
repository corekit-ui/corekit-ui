import { Direction } from '@angular/cdk/bidi'
import { AutoFocusTarget, DialogRole } from '@angular/cdk/dialog'
import { ScrollStrategy } from '@angular/cdk/overlay'

/** Dialog offset from screen edges. */
export type DialogOffset = Partial<{
  top: string
  bottom: string
  left: string
  right: string
}>

/**
 * Determines the dialog behavior when user is scrolling the page.
 *
 * - `scroll` allows scrolling
 * - `block` blocks scrolling
 * - `close` closes the dialog on scroll
 */
export type DialogScrollStrategy = 'scroll' | 'block' | 'close'

/**
 * Dialog configuration to adjust individual dialog instance when opening with
 * `CkDialog.open` or globally with `provideCkDialogConfig` function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CkDialogConfig<D = any> {
  /** Whether the dialog has a backdrop. */
  public hasBackdrop? = true

  /** CSS classes applied to the Overlay backdrop. */
  public backdropClass? =
    'bg-black/10 dark:bg-black/30 data-[state=opened]:animate-in data-[state=opened]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 transition-none'

  /** CSS classes applied to the Overlay panel. */
  public panelClass?: string

  /** Width of the dialog. */
  public width? = '26rem'

  /** Height of the dialog. */
  public height?: string

  /** Min width of the dialog. */
  public minWidth?: string

  /** Min height of the dialog. */
  public minHeight?: string

  /** Max width of the dialog. */
  public maxWidth? = '90dvw'

  /** Max height of the dialog. */
  public maxHeight? = '94dvh'

  /** Dialog offset from screen edges. */
  public offset?: DialogOffset

  /** Data being injected into the child component. */
  public data?: D

  /** Where the dialog should focus on open. */
  public autoFocus?: AutoFocusTarget | (string & {}) = 'first-tabbable'

  /**
   * Determines the dialog behavior when user is scrolling the page.
   *
   * - `block` blocks scrolling (default)
   * - `scroll` allows scrolling
   * - `close` closes the dialog on scroll
   *
   * Alternatively, you can provide your own `ScrollStrategy`
   */
  public scrollStrategy?: DialogScrollStrategy | ScrollStrategy = 'block'

  /** Whether the dialog can be closed by user interactions. */
  public disableClose? = false

  /** Whether the dialog should be closed on browser navigation. */
  public closeOnNavigation? = true

  /**
   * Whether or where to restore focus after dialog is closed.
   * - `boolean` restores focus to previously focused element if `true`, doesn't
   *   restore otherwise.
   * - `string` restores focus to the first element matching the provided CSS
   *   selector.
   * - `HTMLElement` restores focus to the provided element.
   */
  public restoreFocus?: boolean | string | HTMLElement = true

  /** ID of the dialog. */
  public id?: string

  /** ARIA role of the dialog. */
  public role?: DialogRole = 'dialog'

  /** Whether this is a modal dialog. Used to set the `aria-modal` attribute. */
  public ariaModal?: boolean = true

  /** ID of the element that describes the dialog. */
  public ariaDescribedBy?: string

  /** ID of the element that labels the dialog. */
  public ariaLabelledBy?: string

  /** Dialog label applied via `aria-label` */
  public ariaLabel?: string

  /** Layout direction for the dialog's content. */
  public direction?: Direction
}
