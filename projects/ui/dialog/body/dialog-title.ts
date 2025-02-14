import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

const dialogTitleStyles =
  'block text-2xl font-bold leading-tight tracking-tight'

@Directive({
  selector: '[ck-dialog-title], ck-dialog-title',
  standalone: true,
  host: { '[class]': '_class()', role: 'heading', 'aria-level': '2' }
})
export class CkDialogTitle {
  public readonly class = input<string>()

  protected readonly _class = computed(() => {
    return classNames(dialogTitleStyles, this.class())
  })
}
