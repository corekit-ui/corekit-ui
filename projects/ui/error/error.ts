import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { FADE_IN_DOWN } from './fade-in-down.animation'

/**
 * Supposed to be used with `CkFormField`
 */
@Component({
  selector: '[ckError], ck-error',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FADE_IN_DOWN],
  host: { '[class]': '_class', '[@fadeInDown]': '' }
})
export class CkError {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('absolute block text-xs text-destructive', this.class())
  }
}
