import { Directive, inject } from '@angular/core'
import { CdkPortal } from '@angular/cdk/portal'

import { CkTab } from './tab'

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: '[ck-tab-label], [ckTabLabel]',
})
export class CkTabLabel extends CdkPortal {
  public _closestTab = inject(CkTab, { optional: true })
}
