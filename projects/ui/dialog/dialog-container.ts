import { CdkDialogContainer, DialogModule } from '@angular/cdk/dialog'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  signal,
} from '@angular/core'
import { Subject } from 'rxjs'
import { dialogContainerStyles } from './dialog-container.styles'

@Component({
  selector: 'ck-dialog-container',
  imports: [DialogModule],
  template: '<ng-template cdkPortalOutlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '_class',
    '[attr.data-state]': '_state()',
    '(animationend)': '_handleAnimationEnd($event)',
  },
})
export class CkDialogContainer extends CdkDialogContainer {
  public readonly injector = inject(Injector)

  /** Event that is emit right after enter animation completion. */
  public readonly enterAnimationComplete = new Subject<void>()

  /** Event that is emit right after exit animation completion. */
  public readonly exitAnimationComplete = new Subject<void>()

  /** CSS classes to be applied to the container host element. */
  protected readonly _class = dialogContainerStyles

  /** Reflects current dialog state. */
  protected readonly _state = signal<'open' | 'closed'>('open')

  /**
   * Starts exit animation. Actual close of the dialog should happen after the
   * animation is finished.
   * {@link exitAnimationComplete `CkDialogContainer.exitAnimationComplete$`}
   * notifies about that.
   */
  public _startExitAnimation(): void {
    this._state.set('closed')
  }

  protected _handleAnimationEnd(event: AnimationEvent): void {
    if (event.target !== this._elementRef.nativeElement) return

    if (event.animationName === 'enter') {
      return this.enterAnimationComplete.next()
    }

    if (event.animationName === 'exit') {
      return this.exitAnimationComplete.next()
    }
  }
}
