import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const h2 =
  'mt-4 text-xl font-bold !leading-tight tracking-tight first:mt-0 md:mt-6 md:text-2xl'

@Directive({
  selector: '[ckH2], h2',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkH2 {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(h2, this.class())
  }
}
