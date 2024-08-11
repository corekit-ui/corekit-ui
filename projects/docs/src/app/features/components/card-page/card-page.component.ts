import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkButton } from '@corekit/ui/button'
import {
  CkCard,
  CkCardContent,
  CkCardFooter,
  CkCardHeader,
  CkCardSubtitle,
  CkCardTitle
} from '@corekit/ui/card'

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [
    CkCard,
    CkCardHeader,
    CkCardTitle,
    CkCardSubtitle,
    CkCardContent,
    CkCardFooter,
    CkButton
  ],
  templateUrl: './card-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex gap-4' }
})
export class CardPageComponent {}
