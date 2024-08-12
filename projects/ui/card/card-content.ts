import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckCardContent], ck-card-content',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardContent {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('block', this.class())
  }
}
