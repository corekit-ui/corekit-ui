import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkButton } from '@corekit/ui/button'

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [CkButton],
  templateUrl: './button-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex gap-4' }
})
export class ButtonPageComponent {}
