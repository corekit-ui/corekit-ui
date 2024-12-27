import { booleanAttribute, computed, Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { dialogHeaderStyles } from './dialog-header.styles'

@Directive({
  selector: '[ck-dialog-header], ck-dialog-header',
  standalone: true,
  host: { '[class]': '_class()' }
})
export class CkDialogHeader {
  public readonly class = input<string>()

  /**
   * Whether the header should stick to the top of the modal when scrolling.
   * Default behavior.
   */
  public readonly isSticky = input<boolean, unknown>(true, {
    alias: 'sticky',
    transform: booleanAttribute
  })

  protected _class = computed(() => {
    return classNames(
      dialogHeaderStyles({ sticky: this.isSticky() }),
      this.class()
    )
  })
}
