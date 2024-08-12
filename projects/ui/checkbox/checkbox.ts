import { Directive, input, output } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { checkbox, Color } from './checkbox.styles'

@Directive({
  selector: '[ckCheckbox]',
  standalone: true,
  host: {
    '[class]': '_class',
    '(change)': 'checked.emit($event.target.checked)'
  }
})
export class CkCheckbox {
  public readonly class = input<string>()
  public readonly color = input<Color>('primary')
  public readonly checked = output<boolean>()

  protected get _class(): string {
    return classNames(checkbox({ color: this.color() }), this.class())
  }
}