import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DoCheck,
  effect,
  Injector,
  input,
  Optional,
  runInInjectionContext,
  signal
} from '@angular/core'
import { FormGroupDirective, NgControl } from '@angular/forms'
import { CkInput, CkInputPrefix, CkInputSuffix } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'
import { ErrorStateMatcher } from '@corekit/ui/reactive-forms'
import { classNames } from '@corekit/ui/utils'
import { FADE_IN_DOWN } from './animations/fade-in-down.animation'

const formField = 'relative block space-y-0.5 pb-5'

@Component({
  selector: 'ck-form-field, [ckFormField]',
  exportAs: 'ckFormField',
  standalone: true,
  templateUrl: './form-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FADE_IN_DOWN],
  host: { '[class]': '_class' }
})
export class CkFormField implements DoCheck, AfterViewInit {
  public readonly class = input<string>()
  public readonly errorStateMatcher = input<ErrorStateMatcher>()
  public readonly errorState = computed(() => this._errorState())
  public readonly labelId = computed(() => this._label()?.id())

  protected get _class(): string {
    return classNames(
      formField,
      this._errorState() && 'group/invalid',
      this.class()
    )
  }

  private readonly _ngControl = contentChild(NgControl)
  private readonly _label = contentChild(CkLabel)
  private readonly _input = contentChild(CkInput)
  private readonly _inputPrefix = contentChild(CkInputPrefix)
  private readonly _inputSuffix = contentChild(CkInputSuffix)
  private readonly _errorState = signal(false)

  constructor(
    private readonly _injector: Injector,
    private readonly _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional()
    private readonly _formGroupDirective?: FormGroupDirective
  ) {}

  public ngDoCheck(): void {
    // This has to be recalculated every time change detection runs due to a lot
    // of events that we want to react, but cannot subscribe to.
    this._ngControl() && this._calculateErrorState()
  }

  public ngAfterViewInit(): void {
    runInInjectionContext(this._injector, () => {
      effect(this._updateInputPadStart.bind(this), { allowSignalWrites: true })
      effect(this._updateInputPadEnd.bind(this), { allowSignalWrites: true })
    })
  }

  private _updateInputPadStart(): void {
    this._input()?.padStart(!!this._inputPrefix())
  }

  private _updateInputPadEnd(): void {
    this._input()?.padEnd(!!this._inputSuffix())
  }

  private _calculateErrorState(): void {
    const errorStateMatcher =
      this.errorStateMatcher() ?? this._defaultErrorStateMatcher

    const oldState = this._errorState()
    const newState = errorStateMatcher.matches(
      this._ngControl()!,
      this._formGroupDirective
    )

    if (newState !== oldState) this._errorState.set(newState)
  }
}
