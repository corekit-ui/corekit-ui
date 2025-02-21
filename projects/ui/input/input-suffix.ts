import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const inputSuffixStyles = [
  'block',
  'text-muted-foreground',
  'absolute',
  'right-3',
  'pointer-coarse:max-lg:right-3.5',
  '[&:is([ckButton])]:right-1',
  '[&:is([ckButton])]:pointer-coarse:max-lg:right-1.5',
]

@Directive({
  selector: '[ckInputSuffix], ck-input-suffix',
  standalone: true,
  host: { '[class]': '_class' },
})
export class CkInputSuffix {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(inputSuffixStyles, this.class())
  }
}
