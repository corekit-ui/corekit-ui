import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckLabel], label',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkLabel {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(
      'font-medium peer-disabled:opacity-50 group-[]/invalid:text-destructive',
      this.class()
    )
  }
}
