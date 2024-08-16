import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const error = 'block text-xs text-destructive'

@Directive({
  selector: '[ckError], ck-error',
  standalone: true,
  host: { 'aria-live': 'polite', 'aria-atomic': 'true', '[class]': '_class' }
})
export class CkError {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(error, this.class())
  }
}
