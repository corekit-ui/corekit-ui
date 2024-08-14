import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CkButton } from '@corekit/ui/button'
import { CkCheckbox } from '@corekit/ui/checkbox'
import { CkError } from '@corekit/ui/error'
import { CkFormField } from '@corekit/ui/form-field'
import { CkInput, CkInputPrefix, CkInputSuffix } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'
import { CkRadio } from '@corekit/ui/radio'
import { LucideAngularModule } from 'lucide-angular'

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
    ReactiveFormsModule
  ],
  templateUrl: './form-field-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-4' }
})
export class FormFieldPageComponent {
  public prefixVisible = true

  public readonly form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    agreed: [true, Validators.requiredTrue],
    question: ['', Validators.required]
  })

  constructor(private readonly _fb: FormBuilder) {}
}
