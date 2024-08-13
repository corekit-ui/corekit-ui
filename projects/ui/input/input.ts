import { booleanAttribute, Directive, input } from '@angular/core'
import { CkNativeValidator } from '@corekit/ui/reactive-forms'
import { classNames } from '@corekit/ui/utils'
import { inputStyles } from './input.styles'

@Directive({
  selector: '[ckInput]',
  standalone: true,
  hostDirectives: [CkNativeValidator],
  host: { '[class]': '_class' }
})
export class CkInput {
  public readonly class = input<string>()

  public readonly padStart = input<boolean, unknown>(false, {
    transform: booleanAttribute
  })

  public readonly padEnd = input<boolean, unknown>(false, {
    transform: booleanAttribute
  })

  protected get _class(): string {
    return classNames(
      inputStyles({ padStart: this.padStart(), padEnd: this.padEnd() }),
      this.class()
    )
  }
}
