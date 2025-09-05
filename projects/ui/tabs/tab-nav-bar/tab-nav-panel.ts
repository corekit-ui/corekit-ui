import { _IdGenerator } from '@angular/cdk/a11y'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core'

@Component({
  selector: 'ck-tab-nav-panel',
  template: '<ng-content />',
  host: {
    '[attr.aria-labelledby]': '_activeTabId',
    '[attr.id]': 'id',
    role: 'tabpanel',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkTabNavPanel {
  /** Unique id for the tab panel. */
  public readonly id = input<string>(
    inject(_IdGenerator).getId('ck-tab-nav-panel-'),
  )

  /** Id of the active tab in the nav bar. */
  public _activeTabId?: string
}
