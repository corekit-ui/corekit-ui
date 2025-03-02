import { computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import {
  CkDialogActionAlignment,
  dialogActionsStyles,
} from './dialog-actions.styles'

@Directive({
  selector: '[ck-dialog-actions], ck-dialog-actions',
  standalone: true,
  host: { '[class]': '_class()' },
})
export class CkDialogActions {
  public readonly class = input<string>()

  /** Position of the actions in horizontal axis. */
  public readonly align = input<CkDialogActionAlignment>()

  protected _class = computed(() => {
    return classNames(
      dialogActionsStyles({ align: this.align() }),
      this.class(),
    )
  })
}
