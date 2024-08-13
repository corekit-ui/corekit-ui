import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkInput } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-input-page',
  standalone: true,
  imports: [CkInput, CkLabel, LucideAngularModule],
  templateUrl: './input-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-4' }
})
export class InputPageComponent {}
