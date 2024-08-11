import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

export const code =
  'bg-muted text-foreground relative rounded px-[.375rem] py-1 font-mono'

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
