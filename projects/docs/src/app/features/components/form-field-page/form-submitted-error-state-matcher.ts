import { FormGroupDirective, NgControl } from '@angular/forms'
import { ErrorStateMatcher } from '@corekit/ui/reactive-forms'

export class FormSubmittedErrorStateMatcher implements ErrorStateMatcher {
  public matches(control: NgControl, form: FormGroupDirective): boolean {
    return !!control.invalid && form.submitted
  }
}
