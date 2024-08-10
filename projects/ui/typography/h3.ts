import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const h3 = 'mt-4 text-lg font-semibold tracking-tight first:mt-0 md:text-xl'

@Directive({
  selector: '[ckH3], h3',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkH3 {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(h3, this.class())
  }
}
