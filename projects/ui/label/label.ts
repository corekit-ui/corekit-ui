import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

let uniqueIdCounter = 0

@Directive({
  selector: '[ckLabel], label',
  standalone: true,
  host: { '[class]': '_class', '[id]': 'id()' },
})
export class CkLabel {
  public readonly class = input<string>()
  public readonly id = input<string>(`ck-label-${uniqueIdCounter++}`)

  protected get _class(): string {
    return classNames(
      'font-medium peer-disabled:opacity-50 group-[]/invalid:text-destructive',
      this.class(),
    )
  }
}
