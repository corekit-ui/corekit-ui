import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { CkList } from './list'

const ol = 'list-decimal'

@Directive({
  selector: '[ckOl], ol',
  standalone: true,
  hostDirectives: [CkList],
  host: { '[class]': '_class' }
})
export class CkOl {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(ol, this.class())
  }
}
