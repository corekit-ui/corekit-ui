import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const cardContent = `
  block
  px-5 first:pt-5 [&:not(:first-child)]:pt-3 last:pb-5 [&:not(:last-child)]:pb-3
  sm:px-6 sm:first:pt-6 sm:[&:not(:first-child)]:pt-4 sm:last:pb-6 sm:[&:not(:last-child)]:pb-4
  md:px-7 md:first:pt-7 md:[&:not(:first-child)]:pt-5 md:last:pb-7 md:[&:not(:last-child)]:pb-5
`

@Directive({
  selector: '[ckCardContent], ck-card-content',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardContent {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(cardContent, this.class())
  }
}
