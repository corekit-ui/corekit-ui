import {
  afterNextRender,
  Directive,
  ElementRef,
  Injector,
  runInInjectionContext
} from '@angular/core'
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms'

@Directive({
  selector: '[ckNativeValidator]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: CkNativeValidator, multi: true }
  ]
})
export class CkNativeValidator implements Validator {
  private _control?: AbstractControl

  constructor(
    private readonly _host: ElementRef<HTMLInputElement>,
    private readonly _injector: Injector
  ) {}

  public validate(control: AbstractControl): ValidationErrors | null {
    this._control = control

    runInInjectionContext(this._injector, () =>
      afterNextRender(this._translateValidity.bind(this))
    )

    return null
  }

  private _translateValidity(): void {
    const error =
      Object.values(this._control?.errors ?? ({} as Record<string, string>)).at(
        0
      ) ?? 'Invalid'

    this._host.nativeElement.setCustomValidity(
      this._control?.invalid ? error : ''
    )
  }
}
