import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkBadge } from '@corekit/ui/badge'

@Component({
  selector: 'app-badge-page',
  imports: [CkBadge],
  templateUrl: './badge-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-3' },
})
export class BadgePageComponent {}
