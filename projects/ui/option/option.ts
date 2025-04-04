import { FocusableOption, FocusOrigin, Highlightable } from '@angular/cdk/a11y'
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes'
import { NgClass } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Input,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { optionStyles } from './option.styles'

/** Payload of the event emitted by `CkOption` when toggled. */
export class CkOptionSelectionChange<T = unknown> {
  constructor(public readonly source: CkOption<T>) {}
}

let uniqueIdCounter = 0

/**
 * Generic component representing an option in lists such as select,
 * autocomplete or any kind of dropdowns.
 */
@Component({
  selector: 'ck-option, [ck-option]',
  exportAs: 'ckOption',
  imports: [NgClass],
  templateUrl: './option.html',
  host: {
    '[attr.role]': '_role()',
    '[id]': 'id()',
    '[attr.tabindex]': '_tabindex()',
    '[class]': '_class()',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'disabled',
    '(click)': 'toggle()',
    '(keydown)': 'toggleViaKeyboard($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkOption<T = unknown> implements Highlightable, FocusableOption {
  public readonly class = input<string>()
  public readonly role = input<string>()

  protected readonly _role = linkedSignal(() => this.role() ?? 'option')

  /** The unique ID of the option. */
  public readonly id = input(`ck-option-${uniqueIdCounter++}`)

  /** The value of the option. */
  public readonly value = input.required<T>()

  /** Whether to apply alerting styles representing destructive action/value. */
  public readonly destructive = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /** Whether the option is disabled. */
  // Decorator input style is used to satisfy `Highlightable` interface
  @Input({ transform: booleanAttribute })
  public disabled = false

  /** Event emitted each time option is selected or deselected. */
  public readonly selectionChange = output<CkOptionSelectionChange<T>>()

  /**
   * A programmatic alternative of a natively focused state. Useful for components
   * built with `aria-activedescendant`, e.g. Autocomplete.
   */
  public readonly isActive = computed(() => this._isActive())

  /** Whether the option is selected. */
  public readonly isSelected = computed(() => this._isSelected())

  protected readonly _class = computed(() => {
    return classNames(
      optionStyles({
        intent: this.destructive() ? 'destructive' : 'default',
        state: this.isActive() ? 'active' : 'default',
      }),
      this.class(),
    )
  })

  /** Writable of {@link isActive `isActive`}. */
  private readonly _isActive = signal(false)

  /** Writable of {@link isSelected `isSelected`}. */
  private readonly _isSelected = signal(false)

  /** Projected content. */
  private readonly _content =
    viewChild.required<ElementRef<HTMLElement>>('content')

  constructor(
    /** HTML Element of this option. */
    public readonly host: ElementRef<HTMLElement>,
  ) {}

  public setRole(role: string): void {
    if (!this.role()) this._role.set(role)
  }

  /** Selects the option. */
  public select(emitEvent = true): void {
    if (this.isSelected() || this.disabled) return

    this._isSelected.set(true)

    if (!emitEvent) return
    this.selectionChange.emit(new CkOptionSelectionChange<T>(this))
  }

  /** Deselects the option. */
  public deselect(emitEvent = true): void {
    if (!this.isSelected()) return

    this._isSelected.set(false)

    if (!emitEvent) return
    this.selectionChange.emit(new CkOptionSelectionChange<T>(this))
  }

  public toggle(emitEvent = true): void {
    return this.isSelected() ? this.deselect(emitEvent) : this.select(emitEvent)
  }

  /** Sets focus onto this option. */
  public focus(_origin?: FocusOrigin, options?: FocusOptions): void {
    const element = this.host.nativeElement

    if (typeof element.focus === 'function') element.focus(options)
  }

  public getLabel(): string {
    return (this._content().nativeElement.textContent ?? '').trim()
  }

  public setActiveStyles(): void {
    this._isActive.set(true)
  }

  public setInactiveStyles(): void {
    this._isActive.set(false)
  }

  /** Get the tabindex for this option. */
  protected _tabindex(): number {
    if (this.disabled) return -1

    return this.isActive() ? 0 : -1
  }

  /** Selects the option when selection requested with keyboard. */
  protected toggleViaKeyboard(event: KeyboardEvent): void {
    if (
      (event.keyCode !== ENTER && event.keyCode !== SPACE) ||
      hasModifierKey(event)
    ) {
      return
    }

    this.toggle()

    // Prevent form submission (Enter) and page scrolling (Space).
    event.preventDefault()
  }
}
