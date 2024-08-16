import { Injectable } from '@angular/core'
import { FormGroupDirective, NgControl } from '@angular/forms'

@Injectable({ providedIn: 'root' })
export class ErrorStateMatcher {
  public matches(control: NgControl, form: FormGroupDirective): boolean {
    return !!(
      control.invalid &&
      (control.dirty || control.touched || form.submitted)
    )
  }
}
