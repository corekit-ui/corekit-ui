import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const h1 =
  'mt-6 text-2xl font-bold !leading-tight tracking-tight first:mt-0 md:mt-8 md:text-3xl'

@Directive({
  selector: '[ckH1], h1',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkH1 {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(h1, this.class())
  }
}
