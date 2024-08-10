import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const h4 = 'text-md mt-4 font-semibold tracking-tight first:mt-0'

@Directive({
  selector: '[ckH4], h4',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkH4 {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(h4, this.class())
  }
}
