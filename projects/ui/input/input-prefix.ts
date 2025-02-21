import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const inputPrefixStyles = [
  'block',
  'text-muted-foreground',
  'absolute',
  'left-3',
  'pointer-coarse:max-lg:left-3.5',
  'md:[&:is([ckButton])]:left-1',
  '[&:is([ckButton])]:pointer-coarse:max-lg:left-1.5',
]

@Directive({
  selector: '[ckInputPrefix], ck-input-prefix',
  standalone: true,
  host: { '[class]': '_class' },
})
export class CkInputPrefix {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(inputPrefixStyles, this.class())
  }
}
