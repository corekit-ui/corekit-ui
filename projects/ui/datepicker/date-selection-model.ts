import {
  inject,
  Injectable,
  OnDestroy,
  Provider,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core'
import { CkDateAdapter } from '@corekit/ui/core'
import { Observable, Subject } from 'rxjs'

/** Selection change notification. */
export type CkDateSelectionChange<S> = {
  /** New selection value. */
  selection: S

  /** Previous selection value. */
  oldValue: S

  /** Object that made the change, e.g. a datepicker or an input. */
  source: unknown
}

/**
 * State of a date selection shared between a datepicker and its input.
 *
 * Both parties mutate and observe the same model, making it the single source
 * of truth for the selected value. `S` is the shape of the selection — a
 * single date now, a date range later, `D` is the date type.
 */
// Each datepicker provides its own model instance, hence no `providedIn`.
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export abstract class CkDateSelectionModel<S, D> implements OnDestroy {
  /** Current selection. */
  public readonly selection: Signal<S>

  /** Stream of selection changes and their sources. */
  public readonly selectionChanged: Observable<CkDateSelectionChange<S>>

  private readonly _selection: WritableSignal<S>
  private readonly _selectionChanged = new Subject<CkDateSelectionChange<S>>()

  protected constructor(
    initialSelection: S,
    protected readonly _dateAdapter: CkDateAdapter<D>,
  ) {
    this._selection = signal(initialSelection)
    this.selection = this._selection.asReadonly()
    this.selectionChanged = this._selectionChanged.asObservable()
  }

  public ngOnDestroy(): void {
    this._selectionChanged.complete()
  }

  /** Sets the selection, notifying subscribers about the change source. */
  public updateSelection(selection: S, source: unknown): void {
    const oldValue = this.selection()

    this._selection.set(selection)
    this._selectionChanged.next({ selection, oldValue, source })
  }

  /**
   * Adds a date to the selection — sets it for a single date selection, will
   * fill the next free slot for a range.
   */
  public abstract add(date: D | null, source: unknown): void

  /**
   * Whether the selection is complete, e.g. both ends of a range are set.
   */
  public abstract isComplete(): boolean

  /**
   * Whether the selection is internally consistent. Selections made in the
   * calendar always are, but programmatic ones can hold an invalid date or,
   * for a range, an end preceding its start.
   */
  public abstract isValid(): boolean

  protected _isValidDateInstance(date: D): boolean {
    return (
      this._dateAdapter.isDateInstance(date) && this._dateAdapter.isValid(date)
    )
  }
}

/** Selection model holding a single date. */
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class CkSingleDateSelectionModel<D> extends CkDateSelectionModel<
  D | null,
  D
> {
  constructor() {
    super(null, inject<CkDateAdapter<D>>(CkDateAdapter))
  }

  public add(date: D | null, source: unknown): void {
    this.updateSelection(date, source)
  }

  public isComplete(): boolean {
    return this.selection() !== null
  }

  public isValid(): boolean {
    const selection = this.selection()

    return selection !== null && this._isValidDateInstance(selection)
  }
}

/** Provides a selection model holding a single date. */
export const CK_SINGLE_DATE_SELECTION_MODEL_PROVIDER: Provider = {
  provide: CkDateSelectionModel,
  useClass: CkSingleDateSelectionModel,
}
