import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ck-dialog-content], ck-dialog-content',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkDialogContent {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('block px-6', this.class())
  }
}
