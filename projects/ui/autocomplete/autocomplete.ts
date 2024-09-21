// TODO: Implement CK_AUTOCOMPLETE_DEFAULT_OPTIONS

// Some public properties are calculated from private ones, so privates should be
// higher in the code.
/* eslint-disable @typescript-eslint/member-ordering */
import { AnimationEvent } from '@angular/animations'
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  Injector,
  input,
  OnDestroy,
  output,
  Signal,
  signal,
  TemplateRef,
  untracked,
  viewChild
} from '@angular/core'
import {
  outputToObservable,
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop'
import { CkClassNamesPipe } from '@corekit/ui/common'
import { CkOption } from '@corekit/ui/option'
import { classNames, getScrollPosition } from '@corekit/ui/utils'
import { map, merge, switchMap } from 'rxjs'
import { CkAutocompleteTrigger } from './autocomplete-trigger'
import { autocompleteStyles } from './autocomplete.styles'
import { PANEL_ANIMATION } from './panel.animation'

let uniqueIdCounter = 0

/** Autocomplete suggestion panel. */
@Component({
  selector: 'ck-autocomplete, [ck-autocomplete]',
  exportAs: 'ckAutocomplete',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass, CkClassNamesPipe],
  templateUrl: './autocomplete.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [PANEL_ANIMATION],
  host: { class: 'hidden' }
})
export class CkAutocomplete implements OnDestroy {
  public readonly class = input<string>('')

  public readonly ariaLabel = input<string | undefined>(undefined, {
    alias: 'aria-label'
  })

  public readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: 'aria-labelledby'
  })

  /**
   * Function that maps an option's value to its' display value in the trigger.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly displayWith = input<((value: any) => string) | undefined>(
    undefined
  )

  /**
   * Whether the first option should be highlighted when the autocomplete
   * is opened.
   *
   * Can be configured globally through the `CK_AUTOCOMPLETE_DEFAULT_OPTIONS`
   * token.
   */
  public readonly autoActiveFirstOption = input<boolean, unknown>(false, {
    transform: booleanAttribute
  })

  /**
   * Whether it is _required_ to select an option from the list.
   *
   * Typing arbitrary values will reset the field.
   *
   * Ignored if trigger's `autocompleteDisabled` is `true`.
   *
   * Can be configured globally through the `CK_AUTOCOMPLETE_DEFAULT_OPTIONS`
   * token.
   */
  public readonly requireSelection = input<boolean, unknown>(false, {
    transform: booleanAttribute
  })

  /** Event emitted when autocomplete is opened. */
  public readonly opened = output()

  /** Event emitted when autocomplete is closed. */
  public readonly closed = output()

  /** Unique ID of the suggestion panel. */
  public readonly id = `ck-autocomplete-${uniqueIdCounter++}`

  /** Whether the suggestion panel is open. */
  public readonly isOpen = computed(() => !!this._trigger()?._isPanelOpen())

  /** Emits when the suggestion panel opening animation is done. */
  public readonly animationInDone = computed(() => {
    const event = this._animationDone()

    return event?.fromState === 'void' ? event : null
  })

  /** Emits when the suggestion panel closing animation is done. */
  public readonly animationOutDone = computed(() => {
    const event = this._animationDone()

    return event?.toState === 'void' ? event : null
  })

  /** All autocomplete options. */
  public readonly options = contentChildren(CkOption, { descendants: true })

  /** Currently selected option. */
  public readonly selectedOption = computed(() => {
    return this.options().find(option => option.isSelected())
  })

  /** Manages keyboard navigation in the options list. */
  private readonly _keyManager = this._initListKeyManager(this.options)

  /** Currently active (fake focused with keyboard) option. */
  public readonly activeOption = toSignal(
    this._keyManager.change.pipe(map(index => this.options().at(index)))
  )

  /** Reference to the template of the panel. */
  public readonly _template =
    viewChild.required<TemplateRef<{ labelId: string }>>('template')

  /** Trigger that opened the autocomplete. */
  public readonly _trigger = signal<CkAutocompleteTrigger | null>(null)

  /** Stream of changes to the selection state of the autocomplete options. */
  public readonly _selectionChange = toSignal(
    toObservable(this.options).pipe(
      switchMap(options => {
        return merge(
          ...options.map(option => outputToObservable(option.selectionChange))
        )
      })
    )
  )

  /**
   * CSS classes to be applied to the suggestion panel.
   *
   * Can be configured globally through the `CK_AUTOCOMPLETE_DEFAULT_OPTIONS`
   * token.
   */
  protected readonly _class = computed(() => {
    return classNames(autocompleteStyles, this.class())
  })

  /**
   * Writeable of {@link animationInDone `animationInDone`} and
   * {@link animationOutDone `animationOutDone`}.
   */
  protected readonly _animationDone = signal<AnimationEvent | null>(null)

  /** HTML Element containing the list of options. */
  private readonly _panel = viewChild<ElementRef<HTMLDivElement>>('panel')

  constructor(private readonly _injector: Injector) {
    effect(this._optionsChangesEffect.bind(this), { allowSignalWrites: true })
    effect(() => this._scrollTo(this.activeOption()))
  }

  public ngOnDestroy(): void {
    this._keyManager.destroy()
  }

  public _scrollTo(option: CkOption | undefined): void {
    if (!option || !this._panel()) return

    const top = getScrollPosition(
      option.host.nativeElement,
      this._panel()!.nativeElement
    )

    // TODO: configure scroll behavior so it's instant when we need to scroll
    // on opening.
    this._panel()!.nativeElement.scrollTo({ top })
  }

  /** Finds and selects an option whose value equals the passed one. */
  public _selectOptionByValue(value: unknown, emitEvent = true): void {
    if (value == null) return this._deselectAll()

    const optionToSelect = this.options().find(
      option => option.value() === value
    )

    !optionToSelect?.isSelected() && optionToSelect?.select(emitEvent)
  }

  public _deselectAll(): void {
    this.options().forEach(option => option.deselect())
  }

  public _navigate(event: KeyboardEvent): void
  public _navigate(to: CkOption): void
  public _navigate(eventOrOption: KeyboardEvent | CkOption): void {
    if (eventOrOption instanceof KeyboardEvent) {
      return this._keyManager.onKeydown(eventOrOption)
    }

    this._keyManager.setActiveItem(this.options().indexOf(eventOrOption))
  }

  public _open(trigger: CkAutocompleteTrigger): void {
    this._trigger.set(trigger)
    this.opened.emit()
  }

  public _close(): void {
    this._trigger.set(null)
    !this.selectedOption() && this._resetActiveOption()
    this.closed.emit()
  }

  protected _getAriaLabelledby(labelId: string): string | null {
    if (this.ariaLabel()) return null
    if (!this.ariaLabelledby()) return labelId
    if (labelId) return `${labelId} ${this.ariaLabelledby()}`

    return this.ariaLabelledby() ?? null
  }

  private _initListKeyManager(
    options: Signal<readonly CkOption[]>
  ): ActiveDescendantKeyManager<CkOption> {
    return (
      new ActiveDescendantKeyManager(options, this._injector)
        .withWrap()
        // We need to disallow skipping disabled options when navigating. To
        // conform with [Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
        .skipPredicate(() => false)
    )
  }

  private _resetActiveOption(): void {
    // -1 to select first/last item on next arrow navigation regardless of the
    // option's disabled state. This is to conform with WAI-ARIA keyboard navigation
    // spec.
    let resetToIndex = -1

    if (this.autoActiveFirstOption()) {
      // If user enabled autoactivation of the first item, find the first
      // *enabled* item index, so it's more convenient for keyboard users.
      resetToIndex = this.options().findIndex(option => !option.disabled)
    }

    this._keyManager.setActiveItem(resetToIndex)
  }

  /**
   * Runs when options or autoactivation of first option changes.
   *
   * Resets active option.
   */
  private _optionsChangesEffect(): void {
    this.options()
    this.autoActiveFirstOption()

    untracked(this._resetActiveOption.bind(this))
  }
}
