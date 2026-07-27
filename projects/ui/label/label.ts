import { computed, Directive, ElementRef, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

let uniqueIdCounter = 0

const labelStyles = [
  'text-sm',
  'pointer-coarse:max-lg:text-base',
  'font-medium',
  'in-[.ck-invalid]:text-destructive',
  'inline-block',
  'in-[ck-form-field:has([ckInput],ck-select)]:mb-1',
]

@Directive({
  selector: '[ckLabel], label',
  standalone: true,
  host: { '[class]': '_class()', '[id]': 'id()' },
})
export class CkLabel {
  public readonly class = input<string>()
  public readonly id = input<string>(`ck-label-${uniqueIdCounter++}`)

  protected readonly _class = computed(() => {
    return classNames(labelStyles, this.class())
  })

  constructor(
    /** HTML Element of this label. */
    public readonly host: ElementRef<HTMLElement>,
  ) {}
}
