import { ActiveDescendantKeyManager } from '@angular/cdk/a11y'
import { Directionality } from '@angular/cdk/bidi'
import { coerceArray } from '@angular/cdk/coercion'
import { SelectionModel } from '@angular/cdk/collections'
import {
  AfterContentInit,
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectorRef,
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  Input,
  input,
  linkedSignal,
  OnDestroy,
  output,
  untracked,
} from '@angular/core'
import {
  outputToObservable,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { merge, switchMap } from 'rxjs'

import { CkOption } from '@corekit/ui/option'
import { classNames } from '@corekit/ui/utils'

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

/** Change event that is fired whenever the value of the listbox changes. */
export interface ListboxValueChangeEvent<T> {
  /** The new value of the listbox. */
  readonly value: readonly T[]

  /** Reference to the listbox that emitted the event. */
  readonly listbox: CkListbox<T>

  /** Reference to the option that was triggered. */
  readonly option: CkOption<T> | null
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
    '[attr.tabindex]': '_tabindex()',
    '[attr.aria-disabled]': '_disabled()',
    '[attr.aria-multiselectable]': 'multiple()',
    '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
    '(focus)': '_handleFocus()',
    '(keydown)': '_handleKeydown($event)',
    '(focusout)': '_handleFocusOut($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CkListbox),
      multi: true,
    },
  ],
})
export class CkListbox<T = unknown>
  implements AfterContentInit, OnDestroy, ControlValueAccessor
{
  public readonly class = input<string>()
  public readonly id = input(`ck-listbox-${uniqueIdCounter++}`)
  public readonly tabindex = input<number | null | undefined>(0)

  /** The value selected in the listbox, represented as an array of option values. */
  @Input()
  public get value(): readonly T[] {
    return this.selectionModel.selected
  }

  public set value(value: readonly T[]) {
    this._setSelection(value)
  }

  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  public readonly multiple = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  public readonly useActiveDescendant = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /** The function used to compare option values. */
  @Input()
  public get compareWith(): undefined | ((o1: T, o2: T) => boolean) {
    return this.selectionModel.compareWith
  }

  public set compareWith(fn: undefined | ((o1: T, o2: T) => boolean)) {
    this.selectionModel.compareWith = fn
  }

  /** Emits when the selected value(s) in the listbox change. */
  public readonly valueChange = output<ListboxValueChangeEvent<T>>()

  /** The child options in this listbox. */
  public options = contentChildren(CkOption<T>, { descendants: true })

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

  /** The host element of the listbox. */
  protected readonly element = inject(ElementRef).nativeElement as HTMLElement

  /** The directionality of the page. */
  protected readonly _dir = inject(Directionality, { optional: true })

  protected readonly _injector = inject(Injector)

  protected readonly _class = computed(() =>
    classNames('flex flex-col gap-xs', this.class()),
  )

  protected readonly _disabled = linkedSignal(() => this.disabled())

  /** The selection model used by the listbox. */
  protected selectionModel = new ListboxSelectionModel<T>()

  /** The key manager that manages keyboard navigation for the listbox. */
  protected _keyManager = new ActiveDescendantKeyManager(
    this.options,
    this._injector,
  )
    .withWrap()
    .withTypeAhead()
    .withHomeAndEnd()
    .withAllowedModifierKeys(['shiftKey'])
    .skipPredicate(() => false)
    .withHorizontalOrientation(this._dir?.value ?? 'ltr')

  private readonly _keyManagerChange = toSignal(this._keyManager.change)

  private readonly _selectionModelChanged = toSignal(
    this.selectionModel.changed,
  )

  constructor() {
    effect(this._multipleChangeEffect.bind(this))
    effect(this._disabledChangeEffect.bind(this))
    effect(this._selectionChangeEffect.bind(this))
    afterRenderEffect(this._selectionModelChangeEffect.bind(this))
    afterRenderEffect(this._optionsChangeEffect.bind(this))
    effect(this._setActiveOptionEffect.bind(this))
  }

  public ngAfterContentInit(): void {
    this._verifyOptionValues()
  }

  public ngOnDestroy(): void {
    this._keyManager.destroy()
  }

  /**
   * Set the selected state of all options.
   * @param isSelected The new selected state to set
   */
  public setAllSelected(isSelected: boolean): void {
    if (isSelected) {
      this.selectionModel.select(
        ...this.options().map(option => option.value()),
      )
    } else {
      this.selectionModel.clear()
    }
  }

  public writeValue(value: readonly T[] | null | undefined): void {
    this._setSelection(value ?? [])
    this._verifyOptionValues()
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

  /** Focus the listbox's host element. */
  public focus(): void {
    this.element.focus()
  }

  /**
   * Toggle the selected state of the given option.
   * @param option The option to toggle
   */
  public toggle(option: CkOption<T>): void {
    this.selectionModel.toggle(option.value())
  }

  /**
   * Select the given option.
   * @param option The option to select
   */
  public select(option: CkOption<T>): void {
    this.selectionModel.select(option.value())
  }

  /**
   * Deselect the given option.
   * @param option The option to deselect
   */
  public deselect(option: CkOption<T>): void {
    this.selectionModel.deselect(option.value())
  }

  protected _tabindex(): number {
    if (this.disabled()) return -1

    return this._keyManager.activeItem ? -1 : (this.tabindex() ?? 0)
  }

  /** Get the id of the active option if active descendant is being used. */
  protected _getAriaActiveDescendant(): string | null | undefined {
    return this.useActiveDescendant() ? this._keyManager.activeItem?.id() : null
  }

  /** Called when the listbox receives focus. */
  protected _handleFocus(): void {
    if (this.selectionModel.selected.length > 0) {
      this._setNextFocusToSelectedOption()
    } else {
      this._keyManager.setNextItemActive()
    }

    this._setActiveOption(this._keyManager.activeItem!)
  }

  /** Called when the user presses keydown on the listbox. */
  protected _handleKeydown(event: KeyboardEvent): void {
    if (this._disabled()) {
      return
    }

    this._keyManager.onKeydown(event)
  }

  /**
   * Triggers the given option in response to user interaction.
   * - In single selection mode: selects the option and deselects any other selected option.
   * - In multi selection mode: toggles the selected state of the option.
   * @param option The option to trigger
   */
  protected triggerOption(option: CkOption<T> | null | undefined): void {
    if (option && !option.disabled) {
      const changed = this.multiple()
        ? this.selectionModel.toggle(option.value())
        : this.selectionModel.select(option.value())

      if (changed) {
        this._onChange(this.value)
        this.valueChange.emit({
          value: this.value,
          listbox: this,
          option,
        })
      }
    }
  }

  /**
   * Called when the focus leaves an element in the listbox.
   * @param event The focusout event
   */
  protected _handleFocusOut(event: FocusEvent): void {
    // Some browsers (e.g. Chrome and Firefox) trigger the focusout event when the user returns back to the document.
    // To prevent losing the active option in this case, we store it in `_previousActiveOption` and restore it on the window `blur` event
    // This ensures that the `activeItem` matches the actual focused element when the user returns to the document.

    const otherElement = event.relatedTarget as Element

    if (this.element !== otherElement && !this.element.contains(otherElement)) {
      this._onTouched()
      this._keyManager.setActiveItem(-1)
    }
  }

  /** Sets form control value */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onChange: (value: readonly T[]) => void = () => null

  /** Marks form control as touched. */
  // Will be assigned later via `ControlValueAccessor`.
  protected _onTouched: () => void = () => null

  /** Called when multile input is changed.
   *
   * This is used to set the role of the options to either `checkbox` or `radio`.
   * It also clears the selection if the listbox is in single-selection mode and multiple options are selected.
   *
   */
  private _multipleChangeEffect(): void {
    const multiple = this.multiple()

    this.selectionModel.multiple = multiple

    if (!multiple && this.selectionModel.selected.length > 1) {
      this.selectionModel.clear()
      this._onChange(this.selectionModel.selected)
    }

    untracked(() =>
      this.options().forEach(option =>
        option.setRole(multiple ? 'radio' : 'checkbox'),
      ),
    )
  }

  /** Called when the disabled input changes. */
  private _disabledChangeEffect(): void {
    this.options().forEach(option => {
      option.disabled = this._disabled()
    })
  }

  /** Called when the selection changes.
   *
   * This is used to trigger the option that was selected or deselected.
   *
   */
  private _selectionChangeEffect(): void {
    const source = this._selectionChange()?.source
    const value = source?.value()

    if (!value) return

    untracked(() => {
      this.triggerOption(source)
    })
  }

  /** Called when the selection model changes.
   *
   * This is used to set the selected state of the options when the selection model changes.
   *
   */
  private _selectionModelChangeEffect(): void {
    this._selectionModelChanged()

    untracked(() =>
      this.options().forEach(option =>
        this.selectionModel.isSelected(option.value())
          ? option.select(false)
          : option.deselect(false),
      ),
    )
  }

  /** Called when the options change.
   *
   * This is used to reset the key manager if the active option was deleted.
   *
   */
  private _optionsChangeEffect(): void {
    const options = this.options()
    const activeOption = this._keyManager.activeItem

    // If the active option was deleted, we need to reset
    // the key manager so it can allow focus back in.
    if (activeOption && !options.find(option => option === activeOption)) {
      this._keyManager.setActiveItem(-1)
      this._cdr.markForCheck()
    }
  }

  /** Called when the active option changes. */
  private _setActiveOptionEffect(): void {
    const change = this._keyManagerChange()

    if (change === undefined) return

    this._setActiveOption(this._keyManager.activeItem!)
  }

  private _setSelection(value: readonly T[]): void {
    this.selectionModel.setSelection(...coerceArray(value))
  }

  /** Verifies that the option values are valid. */
  private _verifyOptionValues(): void {
    if (this.options().length) {
      const { selected } = this.selectionModel
      const invalidValues = this._getInvalidOptionValues(selected)

      if (!this.multiple() && selected.length > 1) {
        throw Error(
          'Listbox cannot have more than one selected value in single-selection mode.',
        )
      }

      if (invalidValues.length) {
        throw Error(
          'Listbox has selected values that do not match any of its options.',
        )
      }
    }
  }

  /**
   * Get the sublist of values that do not represent valid option values in this listbox.
   * @param values The list of values
   * @return The sublist of values that are not valid option values
   */
  private _getInvalidOptionValues(values: readonly T[]): T[] {
    const isEqual = this.compareWith ?? Object.is
    const validValues = this.options().map(option => option.value)

    return values.filter(
      value => !validValues.some(validValue => isEqual(value, validValue())),
    )
  }

  /** Sets the first selected option as first in the keyboard focus order. */
  private _setNextFocusToSelectedOption(): void {
    const selected = this.options().find(option => option.isSelected())

    if (selected) {
      this._keyManager.updateActiveItem(selected)
    }
  }

  /**
   * Sets the given option as active.
   * @param option The option to make active
   */
  private _setActiveOption(option: CkOption<T>): void {
    this._keyManager.activeItem?.focus()
    this._keyManager.setActiveItem(option)
    this._cdr.markForCheck()
  }
}
