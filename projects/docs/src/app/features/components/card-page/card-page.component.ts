import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkButton } from '@corekit/ui/button'
import {
  CkCard,
  CkCardContent,
  CkCardFooter,
  CkCardHeader,
  CkCardSubtitle,
  CkCardTitle,
} from '@corekit/ui/card'

@Component({
  selector: 'app-card-page',
  imports: [
    CkCard,
    CkCardHeader,
    CkCardTitle,
    CkCardSubtitle,
    CkCardContent,
    CkCardFooter,
    CkButton,
  ],
  templateUrl: './card-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPageComponent {}
