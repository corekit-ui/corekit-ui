import { Directive, input, output } from '@angular/core'
import { CkNativeValidator } from '@corekit/ui/reactive-forms'
import { classNames } from '@corekit/ui/utils'
import { Color, radio } from './radio.styles'

@Directive({
  selector: '[ckRadio]',
  standalone: true,
  hostDirectives: [CkNativeValidator],
  host: {
    '[class]': '_class',
    '(change)': 'checked.emit($event.target.checked)'
  }
})
export class CkRadio {
  public readonly class = input<string>()
  public readonly color = input<Color>('primary')
  public readonly checked = output<unknown>()

  protected get _class(): string {
    return classNames(radio({ color: this.color() }), this.class())
  }
}
