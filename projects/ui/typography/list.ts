import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const list = 'text-base leading-relaxed my-6 ps-6 [&>li:not(:first-child)]:mt-2'

@Directive({
  selector: '[ckList]',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkList {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(list, this.class())
  }
}
