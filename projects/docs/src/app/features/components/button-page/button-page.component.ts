import { ChangeDetectionStrategy, Component, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { LucideAngularModule } from 'lucide-angular'

import { CkButton } from '@corekit/ui/button'
import { CkCheckbox } from '@corekit/ui/checkbox'

@Component({
  selector: 'app-button-page',
  imports: [CkButton, LucideAngularModule, CkCheckbox, FormsModule],
  templateUrl: './button-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-2 ck-typography' },
})
export class ButtonPageComponent {
  public readonly disabled = model(false)
}
