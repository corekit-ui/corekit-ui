import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

export const code =
  'bg-surface-foreground text-surface relative rounded px-[.375rem] py-[0.25rem] font-mono text-sm'

@Directive({
  selector: '[ckCode], code',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCode {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(code, this.class())
  }
}
