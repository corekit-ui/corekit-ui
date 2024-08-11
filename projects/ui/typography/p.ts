import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

// eslint-disable-next-line id-length
const p = 'text-base mt-4 first:mt-0 leading-relaxed'

@Directive({
  selector: '[ckP], p:not([ckLead])',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkP {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(p, this.class())
  }
}
