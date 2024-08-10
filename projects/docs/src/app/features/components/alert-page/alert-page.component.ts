import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkAlert, CkAlertBody, CkAlertTitle } from '@corekit/ui/alert'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-alert-page',
  standalone: true,
  imports: [CkAlert, CkAlertTitle, CkAlertBody, LucideAngularModule],
  templateUrl: './alert-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-4' }
})
export class AlertPageComponent {}
