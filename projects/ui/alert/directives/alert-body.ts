import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckAlertBody], ck-alert-body',
  standalone: true,
  host: { '[class]': '_class' },
})
export class CkAlertBody {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('block text-sm', this.class())
  }
}
