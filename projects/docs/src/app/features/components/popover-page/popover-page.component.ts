import { ChangeDetectionStrategy, Component } from '@angular/core'

import { CkPopover, CkPopoverTrigger } from '@corekit/ui/popover'
import { CkButton } from '@corekit/ui/button'

@Component({
  selector: 'app-popover-page',
  imports: [CkPopover, CkPopoverTrigger, CkButton],
  templateUrl: './popover-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverPageComponent {}
