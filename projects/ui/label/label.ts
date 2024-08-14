import { Directive, input, signal } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckLabel], label',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkLabel {
  public readonly class = input<string>()
  public readonly invalid = signal(false)

  protected get _class(): string {
    return classNames(
      'font-medium peer-invalid:text-destructive peer-disabled:opacity-50',
      this.invalid() && 'text-destructive',
      this.class()
    )
  }
}
