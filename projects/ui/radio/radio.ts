import { computed, Directive, input, output } from '@angular/core'
import { CkNativeValidator } from '@corekit/ui/reactive-forms'
import { classNames } from '@corekit/ui/utils'
import { radio } from './radio.styles'

@Directive({
  selector: '[ckRadio]',
  exportAs: 'ckRadio',
  standalone: true,
  hostDirectives: [CkNativeValidator],
  host: {
    '[class]': '_class()',
    '(change)': 'checked.emit($event.target.checked)',
  },
})
export class CkRadio {
  public readonly class = input<string>()
  public readonly checked = output<unknown>()

  protected readonly _class = computed(() => classNames(radio(), this.class()))
}
