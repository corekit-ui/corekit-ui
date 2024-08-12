import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const card = `
  block shadow-sm rounded-lg border
  p-6 md:p-7
  bg-surface text-surface-foreground
  space-y-4 md:space-y-5
`

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
