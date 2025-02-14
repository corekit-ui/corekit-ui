import { Dialog, DialogConfig } from '@angular/cdk/dialog'
import { ComponentType, Overlay, ScrollStrategy } from '@angular/cdk/overlay'
import {
  effect,
  Inject,
  Injectable,
  OnDestroy,
  Optional,
  signal,
  TemplateRef,
} from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { CK_CLOSABLE } from '@corekit/ui/close'
import { classNames } from '@corekit/ui/utils'
import { filter, map, mergeMap } from 'rxjs'
import { CkDialogConfig, DialogScrollStrategy } from './dialog-config'
import { CkDialogContainer } from './dialog-container'
import { CkDialogRef } from './dialog-ref'
import { CK_DIALOG_DATA, CK_DIALOG_DEFAULT_CONFIG } from './dialog.tokens'

@Injectable({ providedIn: 'root' })
export class CkDialog implements OnDestroy {
  private readonly _openDialogs = signal<CkDialogRef[]>([])

  /** Keeps track of all open dialogs. */
  public readonly openDialogs = this._openDialogs.asReadonly()

  private readonly _scrollStrategies: Record<
    DialogScrollStrategy,
    ScrollStrategy
  > = {
    scroll: this._overlay.scrollStrategies.reposition({
      scrollThrottle: 200,
    }),
    block: this._overlay.scrollStrategies.block(),
    close: this._overlay.scrollStrategies.close(),
  }

  private readonly _lastOpened = signal<CkDialogRef | null>(null)

  private readonly _lastClosed = toSignal(
    toObservable(this._lastOpened).pipe(
      filter(Boolean),
      mergeMap(dialogRef => dialogRef.afterClosed.pipe(map(() => dialogRef))),
    ),
  )

  constructor(
    private readonly _overlay: Overlay,
    private readonly _cdkDialog: Dialog,
    @Inject(CK_DIALOG_DEFAULT_CONFIG)
    @Optional()
    private readonly _defaultConfig?: CkDialogConfig,
  ) {
    effect(this._lastOpenedEffect.bind(this), { allowSignalWrites: true })
    effect(this._lastClosedEffect.bind(this), { allowSignalWrites: true })
  }

  public ngOnDestroy(): void {
    this.openDialogs().forEach(dialog => dialog.close())
  }

  /**
   * Opens a dialog and renders the given component inside.
   * @param component Component to render inside the dialog.
   * @param config Ad-hoc configuration overrides.
   * @returns Reference to the opened dialog.
   */
  public open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C>,
    config?: CkDialogConfig<D>,
  ): CkDialogRef<R, D, C>

  /**
   * Opens a dialog and renders the given template inside.
   *
   * Inside the template, passed data is accessible as implicit template context
   * i.e. `let-data`; dialog reference is accessible with `let-dialogRef="dialogRef"`.
   *
   * @param template TemplateRef to render inside the dialog.
   * @param config Ad-hoc configuration overrides.
   * @returns Reference to the opened dialog.
   */
  public open<R = unknown, D = unknown, C = unknown>(
    template: TemplateRef<C>,
    config?: CkDialogConfig<D>,
  ): CkDialogRef<R, D, C>

  public open<R = unknown, D = unknown, C = unknown>(
    componentOrTemplateRef: ComponentType<C> | TemplateRef<C>,
    config: CkDialogConfig<D> = {},
  ): CkDialogRef<R, D, C> {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let dialogRef: CkDialogRef<R, D, C>

    const defaultConfig = this._defaultConfig ?? new CkDialogConfig()

    const configMergedWithDefault = {
      ...defaultConfig,
      ...config,
      backdropClass: classNames(
        defaultConfig.backdropClass,
        config.backdropClass,
      ),
    }

    const scrollStrategy =
      typeof configMergedWithDefault.scrollStrategy === 'string'
        ? this._scrollStrategies[configMergedWithDefault.scrollStrategy]
        : configMergedWithDefault.scrollStrategy

    this._cdkDialog.open<R, D, C>(componentOrTemplateRef, {
      ...configMergedWithDefault,
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy,
      backdropClass: configMergedWithDefault.backdropClass.split(' '),
      panelClass: configMergedWithDefault.panelClass?.split(' '),
      // Angular CDK Dialog does not support closing animation (and is not
      // planning to – https://github.com/angular/components/issues/28878).
      // To overcome this limitation, we need to disable closing by CDK and
      // reimplement it with animation awareness in our custom `CkDialogRef`.
      disableClose: true,
      closeOnDestroy: false,
      closeOnOverlayDetachments: false,
      templateContext: () => ({ dialogRef }),
      container: {
        type: CkDialogContainer,
        // At this point `CkDialogContainer` has received only config of the
        // CDK, while we want users to be able to receive the full config with
        // all the additions they have passed. So we merge CDK's and our config
        // and provide that instead.
        providers: cdkConfig => {
          const finalConfig = { ...cdkConfig, ...configMergedWithDefault }

          return [
            { provide: CkDialogConfig, useValue: finalConfig },
            { provide: DialogConfig, useValue: finalConfig },
          ]
        },
      },
      providers: (cdkDialogRef, cdkConfig, container) => {
        dialogRef = new CkDialogRef(
          { ...cdkConfig, ...configMergedWithDefault } as CkDialogConfig<D>,
          container as CkDialogContainer,
          cdkDialogRef,
        )

        dialogRef.updatePosition(configMergedWithDefault.offset)

        return [
          { provide: CkDialogContainer, useValue: container },
          { provide: CK_DIALOG_DATA, useValue: cdkConfig.data },
          { provide: CkDialogRef, useValue: dialogRef },
          { provide: CK_CLOSABLE, useValue: dialogRef },
        ]
      },
    })

    this._lastOpened.set(dialogRef!)

    return dialogRef!
  }

  /** Closes all open dialogs. */
  public closeAll(): void {
    this.openDialogs().forEach(dialog => dialog.close())
  }

  private _addToOpenedDialogs(dialogRef: CkDialogRef): void {
    this._openDialogs.update(openDialogs => [...openDialogs, dialogRef])
  }

  private _removeFromOpenedDialogs(dialogRef: CkDialogRef): void {
    this._openDialogs.update(openDialogs => {
      return openDialogs.filter(openDialogRef => openDialogRef !== dialogRef)
    })
  }

  /**
   * Runs when a dialog is opened.
   *
   * Adds the dialog to the opened dialogs array.
   */
  private _lastOpenedEffect(): void {
    const dialogRef = this._lastOpened()

    if (dialogRef) this._addToOpenedDialogs(dialogRef)
  }

  /**
   * Runs when a dialog is closed.
   *
   * Removes the dialog from the opened dialogs array.
   */
  private _lastClosedEffect(): void {
    const dialogRef = this._lastClosed()

    if (dialogRef) this._removeFromOpenedDialogs(dialogRef)
  }
}
