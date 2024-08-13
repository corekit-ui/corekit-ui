import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ckInputSuffix], ck-input-suffix',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkInputSuffix {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(
      'block text-muted-foreground absolute right-3',
      this.class()
    )
  }
}
