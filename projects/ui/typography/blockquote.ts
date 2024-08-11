import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

export const blockquote =
  'text-base leading-relaxed my-6 border-l-4 ps-5 italic'

@Directive({
  selector: '[ckBlockquote], blockquote',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkBlockquote {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(blockquote, this.class())
  }
}
