import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkH1 } from '@corekit/ui/typography'
import { TypographyPageComponent } from './features/components/typography-page/typography-page.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TypographyPageComponent, CkH1],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block container space-y-6 py-6' }
})
export class AppComponent {}
