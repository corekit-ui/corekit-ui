import { computed, Directive, input, output } from '@angular/core'
import { CkNativeValidator } from '@corekit/ui/reactive-forms'
import { classNames } from '@corekit/ui/utils'
import { checkboxStyles } from './checkbox.styles'

@Directive({
  selector: '[ckCheckbox]',
  exportAs: 'ckCheckbox',
  standalone: true,
  hostDirectives: [CkNativeValidator],
  host: {
    '[class]': '_class()',
    '(change)': 'checked.emit($event.target.checked)',
  },
})
export class CkCheckbox {
  public readonly class = input<string>()
  public readonly checked = output<boolean>()

  protected readonly _class = computed(() => {
    return classNames(checkboxStyles(), this.class())
  })
}
