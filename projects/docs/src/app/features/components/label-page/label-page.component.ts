import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkLabel } from '@corekit/ui/label'

@Component({
  selector: 'app-label-page',
  standalone: true,
  imports: [CkLabel],
  templateUrl: './label-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class LabelPageComponent {}
