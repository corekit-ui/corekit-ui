import { computed, Directive, forwardRef, input } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { CdkListbox } from '@angular/cdk/listbox'

import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: 'ck-listbox, [ckListbox]',
  exportAs: 'ckListbox',
  standalone: true,
  host: { '[class]': '_class()', role: 'list' },
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
  inputs: ['disabled', 'multiple'],
})
export class CkListbox<T = unknown> extends CdkListbox<T> {
  public readonly class = input<string>()

  protected readonly _class = computed(() =>
    classNames('flex flex-col gap-xs', this.class()),
  )
}
