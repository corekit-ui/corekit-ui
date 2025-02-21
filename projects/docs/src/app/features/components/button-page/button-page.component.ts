import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkButton } from '@corekit/ui/button'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-button-page',
  imports: [CkButton, LucideAngularModule],
  templateUrl: './button-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ButtonPageComponent {}
