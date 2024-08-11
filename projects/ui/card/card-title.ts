import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const cardTitle = 'text-xl sm:text-2xl font-bold leading-tight tracking-tight'

@Directive({
  selector: '[ckCardTitle], ck-card-title',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardTitle {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(cardTitle, this.class())
  }
}
