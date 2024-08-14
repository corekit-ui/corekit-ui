import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CkH1 } from '@corekit/ui/typography'
import { LucideIconConfig } from 'lucide-angular'
import { AccordionPageComponent } from './features/components/accordion-page/accordion-page.component'
import { AlertPageComponent } from './features/components/alert-page/alert-page.component'
import { AvatarPageComponent } from './features/components/avatar-page/avatar-page.component'
import { BadgePageComponent } from './features/components/badge-page/badge-page.component'
import { ButtonPageComponent } from './features/components/button-page/button-page.component'
import { CardPageComponent } from './features/components/card-page/card-page.component'
import { CheckboxPageComponent } from './features/components/checkbox-page/checkbox-page.component'
import { FormFieldPageComponent } from './features/components/form-field-page/form-field-page.component'
import { InputPageComponent } from './features/components/input-page/input-page.component'
import { LabelPageComponent } from './features/components/label-page/label-page.component'
import { RadioPageComponent } from './features/components/radio-page/radio-page.component'
import { TypographyPageComponent } from './features/components/typography-page/typography-page.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TypographyPageComponent,
    CkH1,
    AccordionPageComponent,
    AlertPageComponent,
    AvatarPageComponent,
    BadgePageComponent,
    ButtonPageComponent,
    CardPageComponent,
    LabelPageComponent,
    CheckboxPageComponent,
    RadioPageComponent,
    InputPageComponent,
    FormFieldPageComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block container space-y-14 py-6 pb-[600px]' }
})
export class AppComponent {
  constructor(private readonly _lucide: LucideIconConfig) {
    this._lucide.size = 18
  }
}
