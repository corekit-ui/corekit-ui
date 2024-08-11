import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const card = 'block rounded-lg border bg-card text-card-foreground shadow-sm'

@Directive({
  selector: '[ckCard], ck-card',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCard {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(card, this.class())
  }
}
