import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckError], ck-error',
  standalone: true,
  host: {
    'aria-live': 'polite',
    'aria-atomic': 'true',
    '[class]': '_class()',
  },
})
export class CkError {
  public readonly class = input<string>()

  protected readonly _class = computed(() => {
    return classNames(
      'block text-xs pointer-coarse:max-lg:text-sm text-destructive',
      this.class(),
    )
  })
}
