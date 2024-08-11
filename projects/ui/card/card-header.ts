import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const cardHeader =
  'flex flex-col space-y-1 pt-5 sm:pt-6 md:pt-7 px-5 sm:px-6 md:px-7'

@Directive({
  selector: '[ckCardHeader], ck-card-header',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardHeader {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(cardHeader, this.class())
  }
}
