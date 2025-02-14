import { Directive, forwardRef, input } from '@angular/core'
import { CdkListbox } from '@angular/cdk/listbox'

import { classNames } from '@corekit/ui/utils'
import { listboxStyles } from './listbox.styles'
import { NG_VALUE_ACCESSOR } from '@angular/forms'

@Directive({
  selector: 'ck-listbox, [ckListbox]',
  exportAs: 'ckListbox',
  standalone: true,
  host: { '[class]': '_class', role: 'list' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CkListbox),
      multi: true,
    },
    {
      provide: CdkListbox,
      useExisting: CkListbox,
    },
  ],
})
export class CkListbox<T = unknown> extends CdkListbox<T> {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(listboxStyles(), this.class())
  }
}
