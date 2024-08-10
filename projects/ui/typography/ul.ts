import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { CkList } from './list'

const ul = 'list-disc'

@Directive({
  selector: '[ckUl], ul',
  standalone: true,
  hostDirectives: [CkList],
  host: { '[class]': '_class' }
})
export class CkUl {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(ul, this.class())
  }
}
