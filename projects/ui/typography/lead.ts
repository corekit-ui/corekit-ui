import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const lead = 'mt-2 text-xl text-muted-foreground first:mt-0'

@Directive({
  selector: '[ckLead]',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkLead {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(lead, this.class())
  }
}
