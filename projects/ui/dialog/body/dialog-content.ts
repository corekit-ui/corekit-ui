// FIXME: There's a bug which is at least reproducible on iOS: dialog lags applying
// correct content height on opening, which results in user seeing the content "jump".
// Also, the backdrop is presented without transition.

import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Directive({
  selector: '[ck-dialog-content], ck-dialog-content',
  standalone: true,
  host: { '[class]': '_class()' },
})
export class CkDialogContent {
  public readonly class = input<string>()

  protected _class = computed(() => {
    return classNames('block px-6 max-h-[65dvh] overflow-y-auto', this.class())
  })
}
