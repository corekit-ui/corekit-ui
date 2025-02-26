import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckCardTitle], ck-card-title',
  standalone: true,
  host: { '[class]': '_class()' },
})
export class CkCardTitle {
  public readonly class = input<string>()

  protected readonly _class = computed(() => {
    return classNames(
      'text-2xl font-bold leading-tight tracking-tight',
      this.class(),
    )
  })
}
