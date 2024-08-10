import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkAvatar } from '@corekit/ui/avatar'

@Component({
  selector: 'app-avatar-page',
  standalone: true,
  imports: [CkAvatar],
  templateUrl: './avatar-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex gap-3' }
})
export class AvatarPageComponent {}
