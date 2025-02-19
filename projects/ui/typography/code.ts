import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckCode], code',
  standalone: true,
  host: { '[class]': '_class()' },
})
export class CkCode {
  public readonly class = input<string>()

  protected readonly _class = computed(() => {
    return classNames('bg-muted font-mono rounded px-1.5 py-1', this.class())
  })
}
