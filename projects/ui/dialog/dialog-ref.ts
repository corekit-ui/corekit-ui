import { DialogRef } from '@angular/cdk/dialog'
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes'
import { GlobalPositionStrategy } from '@angular/cdk/overlay'
import { afterNextRender, runInInjectionContext, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CkClosable } from '@corekit/ui/close'
import { filter, merge, Subject, tap } from 'rxjs'
import { CkDialogConfig, DialogOffset } from './dialog-config'
import { CkDialogContainer } from './dialog-container'

/** Reference of a dialog opened with `CkDialog`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CkDialogRef<R = any, D = any, T = any> implements CkClosable<R> {
  private readonly _afterOpened = new Subject<void>()

  /** Emits when the dialog has finished opening. */
  public readonly afterOpened = this._afterOpened.asObservable()

  private readonly _beforeClosed = new Subject<R | undefined>()

  /** Emits result when the dialog _starts_ closing. */
  public readonly beforeClosed = this._beforeClosed.asObservable()

  /** Emits when the dialog finishes closing. */
  public readonly afterClosed = this._cdkDialogRef.closed

  /** Emits when keydown events dispatched on the overlay. */
  public readonly keydownEvents = this._cdkDialogRef.keydownEvents

  /** Emits when the dialog's backdrop has been clicked. */
  public readonly backdropClick = this._cdkDialogRef.backdropClick

  private readonly _result = signal<R | undefined>(undefined)

  private readonly _closingEvents = merge(
    this.backdropClick,
    this.keydownEvents.pipe(
      filter(event => event.keyCode === ESCAPE && !hasModifierKey(event)),
      tap(event => event.preventDefault()),
    ),
  ).pipe(
    filter(() => !this.config.disableClose),
    tap(event => event.preventDefault()),
  )

  constructor(
    public readonly config: CkDialogConfig<D>,
    private readonly _containerInstance: CkDialogContainer,
    private readonly _cdkDialogRef: DialogRef<R, T>,
  ) {
    this._setBackdropState('opened')

    this._containerInstance.onAfterOpened = this._notifyOpened.bind(this)
    this._containerInstance.onAfterClosed = this._finishClosing.bind(this)

    runInInjectionContext(this._containerInstance.injector, () => {
      this._closingEvents
        .pipe(
          tap(() => this.close()),
          takeUntilDestroyed(),
        )
        .subscribe()
    })
  }

  /**
   * Updates dialog's position.
   *
   * @param offset Dialog offset from screen edges.
   */
  public updatePosition(offset?: DialogOffset): this {
    const strategy = this._cdkDialogRef.config
      .positionStrategy as GlobalPositionStrategy

    if (offset?.left) strategy.left(offset.left)
    else if (offset?.right) strategy.right(offset.right)

    if (offset?.top) strategy.top(offset.top)
    else if (offset?.bottom) strategy.bottom(offset.bottom)

    this._cdkDialogRef.updatePosition()

    return this
  }

  /**
   * Updates dialog's width and height.
   *
   * @param width New width in any CSS units.
   * @param height New height in any CSS units.
   */
  public updateSize(width = '', height = ''): this {
    this._cdkDialogRef.updateSize(width, height)

    return this
  }

  /**
   * Adds CSS classes to the Overlay panel.
   *
   * @param classes CSS class(es) to be applied.
   */
  public addPanelClass(classes: string): this {
    this._cdkDialogRef.addPanelClass(classes.split(' '))

    return this
  }

  /**
   * Remove CSS classes from the Overlay panel.
   *
   * @param classes CSS class(es) to be removed.
   */
  public removePanelClass(classes: string): this {
    this._cdkDialogRef.removePanelClass(classes.split(' '))

    return this
  }

  /**
   * Closes the dialog.
   *
   * @param result Data to be emitted to the dialog opener when the dialog closes.
   */
  public close(result?: R): void {
    this._result.set(result)
    this._notifyClosing()
    this._containerInstance._close()
    this._setBackdropState('closed')
  }

  /**
   * Sets dialog's backdrop overlay state, which is used to trigger
   * opening/closing animations.
   *
   * @param state New state.
   */
  private _setBackdropState(state: 'opened' | 'closed'): void {
    this._cdkDialogRef.overlayRef.backdropElement?.setAttribute(
      'data-state',
      state,
    )
  }

  /** Notify opener that the dialog has finished opening. */
  private _notifyOpened(): void {
    this._afterOpened.next()
    this._afterOpened.complete()
  }

  /** Notify opener that the dialog has started closing. */
  private _notifyClosing(): void {
    this._beforeClosed.next(this._result())
    this._beforeClosed.complete()
  }

  /**
   * Actually closes the dialog as {@link CkDialogRef.close `CkDialogRef.close`}
   * only triggers closing _animation_ start.
   */
  private _finishClosing(): void {
    afterNextRender(() => this._cdkDialogRef.close(this._result()), {
      injector: this._containerInstance.injector,
    })
  }
}
