import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkButton } from '@corekit/ui/button'
import { CkH4 } from '@corekit/ui/typography'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [CkButton, CkH4, LucideAngularModule],
  templateUrl: './button-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'space-y-4' },
})
export class ButtonPageComponent {}
