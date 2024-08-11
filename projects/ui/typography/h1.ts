import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const h1 =
  'mt-6 text-3xl font-extrabold md:font-bold tracking-tight first:mt-0 md:mt-8'

@Directive({
  selector: '[ckH1], h1:not([ckDisplay])',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkH1 {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(h1, this.class())
  }
}
