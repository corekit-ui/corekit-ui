import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const display =
  'mt-6 text-3xl font-extrabold !leading-tight tracking-tight first:mt-0 md:mt-8 md:text-4xl lg:text-5xl'

@Directive({
  selector: '[ckDisplay]',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkDisplay {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(display, this.class())
  }
}
