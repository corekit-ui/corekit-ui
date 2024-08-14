import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  Injector,
  input,
  runInInjectionContext,
  Signal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControlStatus, NgControl } from '@angular/forms'
import { CkInput, CkInputPrefix, CkInputSuffix } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'
import { classNames } from '@corekit/ui/utils'
import { distinctUntilChanged, startWith } from 'rxjs'

const formField = 'relative block space-y-1 pb-5'

@Component({
  selector: 'ck-form-field, [ckFormField]',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '_class' }
})
export class CkFormField implements AfterContentInit, AfterViewInit {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(formField, this.class())
  }

  private readonly _ngControl = contentChild.required(NgControl)
  private readonly _label = contentChild(CkLabel)
  private readonly _input = contentChild(CkInput)
  private readonly _inputPrefix = contentChild(CkInputPrefix)
  private readonly _inputSuffix = contentChild(CkInputSuffix)

  private _ngControlStatus!: Signal<FormControlStatus>

  constructor(private readonly _injector: Injector) {
    effect(this._updateLabelValidity.bind(this), { allowSignalWrites: true })
  }

  public ngAfterContentInit(): void {
    runInInjectionContext(
      this._injector,
      this._setupNgControlStatusEmitter.bind(this)
    )
  }

  public ngAfterViewInit(): void {
    runInInjectionContext(this._injector, () => {
      effect(this._updateInputPadStart.bind(this), { allowSignalWrites: true })
      effect(this._updateInputPadEnd.bind(this), { allowSignalWrites: true })
    })
  }

  private _setupNgControlStatusEmitter(): void {
    const status$ = this._ngControl().statusChanges!.pipe(
      distinctUntilChanged(),
      startWith(this._ngControl().status as FormControlStatus)
    )

    this._ngControlStatus = toSignal(status$, { requireSync: true })
  }

  private _updateLabelValidity(): void {
    this._label()?.invalid.set(this._ngControlStatus() === 'INVALID')
  }

  private _updateInputPadStart(): void {
    this._input()?.padStart(!!this._inputPrefix())
  }

  private _updateInputPadEnd(): void {
    this._input()?.padEnd(!!this._inputSuffix())
  }
}
