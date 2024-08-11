import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const alertBody = '[&_p]:leading-relaxed block'

@Directive({
  selector: '[ckAlertBody], ck-alert-body',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkAlertBody {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(alertBody, this.class())
  }
}
