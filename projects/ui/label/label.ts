import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

let uniqueIdCounter = 0

@Directive({
  selector: '[ckLabel], label',
  standalone: true,
  host: { '[class]': '_class()', '[id]': 'id()' },
})
export class CkLabel {
  public readonly class = input<string>()
  public readonly id = input<string>(`ck-label-${uniqueIdCounter++}`)

  protected readonly _class = computed(() => {
    return classNames(
      'font-medium in-[.ck-invalid]:text-destructive inline-block in-[ck-form-field:has([ckInput])]:mb-0.5',
      this.class(),
    )
  })
}
