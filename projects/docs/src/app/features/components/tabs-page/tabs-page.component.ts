import { ChangeDetectionStrategy, Component } from '@angular/core'

import { CkTab, CkTabContent, CkTabGroup, CkTabLabel } from '@corekit/ui/tabs'

@Component({
  selector: 'app-tabs-page',
  imports: [CkTabGroup, CkTab, CkTabLabel, CkTabContent],
  templateUrl: './tabs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPageComponent {}
