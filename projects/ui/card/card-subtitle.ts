import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const cardSubtitle = 'text-muted-foreground'

@Directive({
  selector: '[ckCardSubtitle], ck-card-subtitle',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkCardSubtitle {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(cardSubtitle, this.class())
  }
}