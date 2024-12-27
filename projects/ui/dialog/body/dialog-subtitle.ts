import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ck-dialog-subtitle], ck-dialog-subtitle',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkDialogSubtitle {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('text-muted-foreground', this.class())
  }
}
