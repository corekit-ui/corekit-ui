import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  CkBlockquote,
  CkCode,
  CkDisplay,
  CkH1,
  CkH2,
  CkH3,
  CkH4,
  CkLead,
  CkOl,
  CkP,
  CkSmall,
  CkUl
} from '@corekit/ui/typography'

@Component({
  selector: 'app-typography-page',
  standalone: true,
  imports: [
    CkDisplay,
    CkH1,
    CkH2,
    CkH3,
    CkH4,
    CkLead,
    CkP,
    CkSmall,
    CkBlockquote,
    CkUl,
    CkOl,
    CkCode
  ],
  templateUrl: './typography-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class TypographyPageComponent {}
