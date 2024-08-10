import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkH1 } from '@corekit/ui/typography'
import { LucideIconConfig } from 'lucide-angular'
import { AccordionPageComponent } from './features/components/accordion-page/accordion-page.component'
import { AlertPageComponent } from './features/components/alert-page/alert-page.component'
import { AvatarPageComponent } from './features/components/avatar-page/avatar-page.component'
import { TypographyPageComponent } from './features/components/typography-page/typography-page.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TypographyPageComponent,
    CkH1,
    AccordionPageComponent,
    AlertPageComponent,
    AvatarPageComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block container space-y-8 py-6 pb-[600px]' }
})
export class AppComponent {
  constructor(private readonly _lucide: LucideIconConfig) {
    this._lucide.size = 16
  }
}
