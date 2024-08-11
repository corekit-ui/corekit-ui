import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { Appearance, button, Color, Shape, Size } from './button.styles'

@Directive({
  selector: '[ckButton]',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkButton {
  public readonly class = input<string>()
  public readonly size = input<Size>('md')
  public readonly shape = input<Shape>('rectangle')
  public readonly color = input<Color>('primary')
  public readonly appearance = input<Appearance>('solid')

  protected get _class(): string {
    return classNames(
      button({
        size: this.size(),
        shape: this.shape(),
        color: this.color(),
        appearance: this.appearance()
      }),
      this.class()
    )
  }
}
