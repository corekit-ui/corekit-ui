import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const cardFooter =
  'flex items-center gap-3 px-5 sm:px-6 md:px-7 pb-5 sm:pb-6 md:pb-7'

@Directive({
  selector: '[ckCardFooter], ck-card-footer',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardFooter {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(cardFooter, this.class())
  }
}
