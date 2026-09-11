import { Dir } from '@angular/cdk/bidi'
import { JsonPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CkCheckbox } from '@corekit/ui/checkbox'
import { provideNativeDateAdapter } from '@corekit/ui/core'
import {
  CkCalendar,
  CkDatepicker,
  CkDatepickerInput,
  CkDatepickerToggle,
} from '@corekit/ui/datepicker'
import { CkError, CkFormField } from '@corekit/ui/form-field'
import { CkInput, CkInputSuffix } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'

@Component({
  selector: 'app-datepicker-page',
  imports: [
    CkCalendar,
    CkCheckbox,
    Dir,
    CkDatepicker,
    CkDatepickerInput,
    CkDatepickerToggle,
    CkError,
    CkFormField,
    CkInput,
    CkInputSuffix,
    CkLabel,
    JsonPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './datepicker-page.component.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block ck-typography' },
})
export class DatepickerPageComponent {
  protected readonly minDate = new Date(2026, 6, 5)
  protected readonly maxDate = new Date(2026, 7, 20)
  protected readonly birthdayStartAt = new Date(2000, 0, 1)

  protected readonly form = inject(FormBuilder).group({
    date: [new Date(2026, 6, 15), Validators.required],
  })

  protected readonly isFormDisabled = signal(false)
  protected readonly inlineDate = signal<Date | null>(null)

  protected readonly noSundays = (date: Date): boolean => date.getDay() !== 0

  protected toggleFormDisabled(): void {
    this.isFormDisabled.update(disabled => !disabled)

    if (this.isFormDisabled()) return this.form.controls.date.disable()

    this.form.controls.date.enable()
  }
}
