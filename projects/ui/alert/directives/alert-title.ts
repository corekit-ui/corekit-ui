import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const alertTitle = 'mb-1 font-medium leading-none tracking-tight block'

@Directive({
  selector: '[ckAlertTitle], ck-alert-title',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkAlertTitle {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(alertTitle, this.class())
  }
}
