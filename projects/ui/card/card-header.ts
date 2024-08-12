import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckCardHeader], ck-card-header',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardHeader {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('flex flex-col space-y-1', this.class())
  }
}
