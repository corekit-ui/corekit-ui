import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckCardFooter], ck-card-footer',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardFooter {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('flex items-center gap-3', this.class())
  }
}
