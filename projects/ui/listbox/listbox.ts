import { coerceArray } from '@angular/cdk/coercion'
import { SelectionModel } from '@angular/cdk/collections'
import {
  booleanAttribute,
  ChangeDetectorRef,
  computed,
  contentChildren,
  Directive,
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  untracked,
} from '@angular/core'
import {
  outputToObservable,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { CkOption } from '@corekit/ui/option'
import { classNames } from '@corekit/ui/utils'
import { merge, switchMap } from 'rxjs'

/**
 * An implementation of SelectionModel that internally always represents the selection as a
 * multi-selection. This is necessary so that we can recover the full selection if the user
 * switches the listbox from single-selection to multi-selection after initialization.
 *
 * This selection model may report multiple selected values, even if it is in single-selection
 * mode. It is up to the user (CkListbox) to check for invalid selections.
 */
class ListboxSelectionModel<T> extends SelectionModel<T> {
  constructor(
    public multiple = false,
    initiallySelectedValues?: T[],
    emitChanges = true,
    compareWith?: (o1: T, o2: T) => boolean,
  ) {
    super(true, initiallySelectedValues, emitChanges, compareWith)
  }

  public override isMultipleSelection(): boolean {
    return this.multiple
  }

  public override select(...values: T[]): boolean | void {
    // The super class is always in multi-selection mode, so we need to override the behavior if
    // this selection model actually belongs to a single-selection listbox.
    if (this.multiple) {
      return super.select(...values)
    }

    return super.setSelection(...values)
  }
}

let uniqueIdCounter = 0

@Directive({
  selector: 'ck-listbox, [ck-listbox]',
  exportAs: 'ckListbox',
  standalone: true,
  host: {
    role: 'list',
    '[class]': '_class()',
    '[id]': 'id()',
    '[attr.tabindex]': 'tabindex()',
    '[attr.aria-disabled]': '_disabled',
    '[attr.aria-multiselectable]': 'multiple',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CkListbox),
      multi: true,
    },
  ],
})
export class CkListbox<T = unknown> implements ControlValueAccessor {
  public readonly class = input<string>()
  public readonly id = input<string>(`ck-label-${uniqueIdCounter++}`)
  public readonly tabindex = input<number>(0)
  // public readonly value = input<T[]>(this.selectionModel.selected)

  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  public readonly multiple = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /** The child options in this listbox. */
  public options = contentChildren(CkOption, { descendants: true })

  /** Stream of changes to the selection state of the autocomplete options. */
  public readonly _selectionChange = toSignal(
    toObservable(this.options).pipe(
      switchMap(options => {
        return merge(
          ...options.map(option => outputToObservable(option.selectionChange)),
        )
      }),
    ),
  )

  /** The change detector for this listbox. */
  protected readonly _cdr = inject(ChangeDetectorRef)

  protected readonly _class = computed(() =>
    classNames('flex flex-col gap-xs', this.class()),
  )

  protected readonly _disabled = linkedSignal(() => this.disabled())

  /** The selection model used by the listbox. */
  protected selectionModel = new ListboxSelectionModel<T>()

  /** Whether the currently selected value in the selection model is invalid. */
  private readonly _invalid = false

  private readonly _selectionModelChanged = toSignal(
    this.selectionModel.changed,
  )

  constructor() {
    effect(() => {
      this.selectionModel.multiple = this.multiple()
    })

    effect(() => {
      this.options().forEach(option =>
        option.setRole(this.multiple() ? 'radio' : 'checkbox'),
      )
    })

    effect(() => {
      this.options().forEach(option => {
        option.disabled = this.disabled()
      })
    })

    effect(() => {
      if (!this.options().length) return

      const source = this._selectionChange()?.source
      const value = source?.value() as T

      console.log(value)

      // untracked(() => {
      if (this.multiple()) {
        this.selectionModel.toggle(value)
        console.log(this.selectionModel.selected)
        // this.options().forEach(option => {
        //   if (option === source && option.isSelected()) {
        //     option.deselect(false)
        //   }
        // })
      } else {
        this.selectionModel.select(value)
        this.options().forEach(option =>
          option === source ? option.select(false) : option.deselect(false),
        )
      }
      // })
    })

    effect(() => {
      // const changes = this._selectionModelChanged()
      // this.options().forEach(option => {
      //   if (
      //     changes?.added.includes(option.value() as T) ||
      //     changes?.removed.includes(option.value() as T)
      //   ) {
      //     option.toggle()
      //   }
      // })
    })
  }

  public writeValue(value: readonly T[]): void {
    this._setSelection(value)
    // this._verifyOptionValues();
  }

  public registerOnChange(fn: (value: readonly T[]) => void): void {
    this._onChange = fn
  }

  public registerOnTouched(fn: () => null): void {
    this._onTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled)
    this._cdr.markForCheck()
  }

  /** Sets form control value */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onChange: (value: readonly T[]) => void = () => null

  /** Marks form control as touched. */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onTouched: () => void = () => null

  private _setSelection(value: readonly T[]): void {
    if (this._invalid) {
      this.selectionModel.clear(false)
    }
    this.selectionModel.setSelection(...coerceArray(value))

    console.log(this.selectionModel)
  }
}
