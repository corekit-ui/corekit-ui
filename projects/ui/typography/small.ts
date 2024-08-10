import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const small = 'text-sm font-medium leading-none text-muted-foreground'

@Directive({
  selector: '[ckSmall], small',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkSmall {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(small, this.class())
  }
}
