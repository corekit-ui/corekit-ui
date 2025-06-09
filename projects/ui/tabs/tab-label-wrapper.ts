import { Directive, booleanAttribute, computed, input } from '@angular/core'

import { classNames } from '@corekit/ui/utils'
import { labelWrapperStyles } from './styles'

/**
 * Used in the `ck-tab-group` view to display tab labels.
 */
@Directive({
  selector: '[ckTabLabelWrapper]',
  host: {
    '[attr.aria-disabled]': 'disabled()',
    '[class]': '_class()',
  },
})
export class CkTabLabelWrapper {
  public readonly active = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /** Whether the tab is disabled. */
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  private readonly _class = computed(() =>
    classNames(
      labelWrapperStyles({ state: this.active() ? 'active' : 'default' }),
    ),
  )
}
