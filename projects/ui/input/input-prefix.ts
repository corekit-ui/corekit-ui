import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckInputPrefix], ck-input-prefix',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkInputPrefix {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(
      'block text-muted-foreground absolute left-3',
      this.class()
    )
  }
}
