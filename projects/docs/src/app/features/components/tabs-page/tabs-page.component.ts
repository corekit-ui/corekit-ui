import { ChangeDetectionStrategy, Component } from '@angular/core'

import {
  CkTab,
  CkTabContent,
  CkTabGroup,
  CkTabLabel,
  CkTabLink,
  CkTabNav,
  CkTabNavPanel,
} from '@corekit/ui/tabs'

@Component({
  selector: 'app-tabs-page',
  imports: [
    CkTabGroup,
    CkTab,
    CkTabLabel,
    CkTabContent,
    CkTabNavPanel,
    CkTabNav,
    CkTabLink,
  ],
  templateUrl: './tabs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPageComponent {
  public readonly links = ['First', 'Second', 'Third']
  public activeLink = this.links[1]
}
