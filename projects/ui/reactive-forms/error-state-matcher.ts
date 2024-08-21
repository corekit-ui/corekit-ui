import { Injectable } from '@angular/core'
import {
  AbstractControl,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms'

@Injectable({ providedIn: 'root' })
export class ErrorStateMatcher {
  public matches(
    control: AbstractControl | NgControl | null,
    form: FormGroupDirective | NgForm | null | undefined,
  ): boolean {
    return !!(
      control?.invalid &&
      (control.dirty || control.touched || form?.submitted)
    )
  }
}
