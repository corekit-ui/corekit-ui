import { AnimationEvent } from '@angular/animations'
import { CdkDialogContainer, DialogModule } from '@angular/cdk/dialog'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core'
import { dialogContainerStyles } from './dialog-container.styles'
import { ZOOM_IN } from './zoom-in.animation'

type AnimationState = 'opening' | 'opened' | 'closing' | 'closed'

@Component({
  selector: 'ck-dialog-container',
  imports: [DialogModule],
  template: '<ng-template cdkPortalOutlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ZOOM_IN],
  host: {
    '[class]': '_class()',
    '[@zoomIn]': '_animationState()',
    '(@zoomIn.done)': '_setAnimationState($event)',
  },
})
export class CkDialogContainer extends CdkDialogContainer implements OnInit {
  public readonly injector = inject(Injector)

  /** CSS classes to be applied to the container host element. */
  protected readonly _class = dialogContainerStyles

  /** Reflects current animation state. */
  private readonly _animationState = signal<AnimationState>('opening')

  public ngOnInit(): void {
    effect(this._animationStateEffect.bind(this), { injector: this.injector })
  }

  /**
   * Callback to be executed right after dialog has finished opening animation.
   */
  public onAfterOpened: (...args: unknown[]) => void = () => null

  /**
   * Callback to be executed right after dialog has finished closing animation.
   */
  public onAfterClosed: (...args: unknown[]) => void = () => null

  /**
   * Starts closing animation. Actual close happens after animation is finished,
   * in {@link CkDialogRef.close `CkDialogRef.close`}
   */
  public _close(): void {
    this._animationState.set('closing')
  }

  /** Translates animation event into understandable animation status. */
  protected _setAnimationState(event: AnimationEvent): void {
    if (event.fromState === 'void' && event.toState === 'opening') {
      this._animationState.set('opened')
    }

    if (event.fromState === 'opened' && event.toState === 'closing') {
      this._animationState.set('closed')
    }
  }

  /**
   * Runs when animation state changes.
   *
   * Runs callbacks provided by the consumer depending on the animation state.
   */
  private _animationStateEffect(): void {
    const animationState = this._animationState()

    if (animationState === 'opened') return this.onAfterOpened()
    if (animationState === 'closed') return this.onAfterClosed()
  }
}
