import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const cardStyles = `block space-y-4 rounded-lg border bg-surface p-6 text-surface-foreground shadow-sm md:space-y-5`

@Directive({
  selector: '[ckCard], ck-card',
  standalone: true,
  host: { '[class]': '_class()' }
})
export class CkCard {
  public readonly class = input<string>()

  protected _class = computed(() => classNames(cardStyles, this.class()))
}
