import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckCardSubtitle], ck-card-subtitle',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardSubtitle {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames('text-muted-foreground', this.class())
  }
}
