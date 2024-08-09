import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkButton } from '@corekit/ui/button'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CkButton],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppComponent {}
