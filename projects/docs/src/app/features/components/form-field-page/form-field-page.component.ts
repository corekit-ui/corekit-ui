import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CkButton } from '@corekit/ui/button'
import { CkCheckbox } from '@corekit/ui/checkbox'
import { CkError, CkFormField } from '@corekit/ui/form-field'
import { CkInput, CkInputPrefix, CkInputSuffix } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'
import { CkRadio } from '@corekit/ui/radio'
import { CkCode } from '@corekit/ui/typography'
import { LucideAngularModule } from 'lucide-angular'
import { FormSubmittedErrorStateMatcher } from './form-submitted-error-state-matcher'

@Component({
  selector: 'app-form-field-page',
  standalone: true,
  imports: [
    CkLabel,
    CkInput,
    CkInputPrefix,
    CkInputSuffix,
    CkFormField,
    CkError,
    CkCheckbox,
    CkButton,
    CkRadio,
    LucideAngularModule,
    ReactiveFormsModule,
    CkCode
  ],
  templateUrl: './form-field-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-4' }
})
export class FormFieldPageComponent {
  public prefixVisible = true

  public readonly formSubmittedErrorStateMatcher =
    new FormSubmittedErrorStateMatcher()

  public readonly form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    agreed: [true, Validators.requiredTrue],
    question: ['', Validators.required]
  })

  constructor(private readonly _fb: FormBuilder) {}
}
