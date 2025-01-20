// TODO: Implement CK_AUTOCOMPLETE_DEFAULT_OPTIONS

// Some public properties are calculated from private ones, so privates should be
// higher in the code.
/* eslint-disable @typescript-eslint/member-ordering */
import { AnimationEvent } from '@angular/animations'
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y'
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common'
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
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core'
import {
  outputToObservable,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop'
import { CkOption } from '@corekit/ui/option'
import { classNames, getScrollPosition } from '@corekit/ui/utils'
import { filter, map, merge, Subject, switchMap } from 'rxjs'
import { CkAutocompleteTrigger } from './autocomplete-trigger'
import { autocompleteStyles } from './autocomplete.styles'
import { ZOOM_IN_ANIMATION } from './zoom-in.animation'

let uniqueIdCounter = 0

/** Autocomplete suggestion panel. */
@Component({
  selector: 'ck-autocomplete, [ck-autocomplete]',
  exportAs: 'ckAutocomplete',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass, AsyncPipe],
  templateUrl: './autocomplete.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ZOOM_IN_ANIMATION],
  host: { class: 'hidden' },
})
export class CkAutocomplete implements OnDestroy {
  public readonly class = input<string>('')

  public readonly ariaLabel = input<string | undefined>(undefined, {
    alias: 'aria-label',
  })

  public readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: 'aria-labelledby',
  })

  /**
   * Function that maps an option's value to its' display value in the trigger.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly displayWith = input<(value: any) => string>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    value => value,
  )

  /**
   * Whether the first option should be highlighted when the autocomplete
   * is opened.
   *
   * Can be configured globally through the `CK_AUTOCOMPLETE_DEFAULT_OPTIONS`
   * token.
   */
  public readonly autoActiveFirstOption = input<boolean, unknown>(false, {
    transform: booleanAttribute,
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
    transform: booleanAttribute,
  })

  /** Event emitted when autocomplete is opened. */
  public readonly opened = output()

  /** Event emitted when autocomplete is closed. */
  public readonly closed = output()

  /** Unique ID of the suggestion panel. */
  public readonly id = `ck-autocomplete-${uniqueIdCounter++}`

  /** Whether the suggestion panel is open. */
  public readonly isOpen = computed(() => !!this._trigger()?.isPanelOpen())

  /** All autocomplete options. */
  public readonly options = contentChildren(CkOption, { descendants: true })

  /** Currently selected option. */
  public readonly selectedOption = computed(() => {
    return this.options().find(option => option.isSelected())
  })

  /** Manages keyboard navigation in the options list. */
  private readonly _keyManager = new ActiveDescendantKeyManager(
    this.options,
    this._injector,
  )
    .withWrap()
    // Disallow skipping disabled options when navigating. This is to conform
    // with https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
    .skipPredicate(() => false)

  /** Currently active (fake focused with keyboard) option. */
  public readonly activeOption = toSignal(
    this._keyManager.change.pipe(map(index => this.options()[index])),
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
          ...options.map(option => outputToObservable(option.selectionChange)),
        )
      }),
    ),
  )

  /** Stream of animation completion events. */
  public readonly _animationDone = new Subject<AnimationEvent>()

  /** Stream of closing animation completion events. */
  public readonly _animationOutDone = toSignal(
    this._animationDone.pipe(
      filter(event => {
        return event.fromState === 'open' && event.toState === 'closed'
      }),
    ),
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

  protected readonly _animationState = signal<'open' | 'closed'>('closed')

  /** HTML Element containing the list of options. */
  private readonly _panel = viewChild<ElementRef<HTMLDivElement>>('panel')

  constructor(private readonly _injector: Injector) {
    effect(this._optionsChangesEffect.bind(this), { allowSignalWrites: true })
    effect(() => this._scrollTo(this.activeOption()))
    effect(this._openEffect.bind(this), {
      allowSignalWrites: true,
    })
  }

  public ngOnDestroy(): void {
    this._keyManager.destroy()
  }

  public _scrollTo(option: CkOption | undefined): void {
    if (!option || !this._panel()) return

    const top = getScrollPosition(
      option.host.nativeElement,
      this._panel()!.nativeElement,
    )

    // TODO: configure scroll behavior so it's instant when we need to scroll
    // on opening.
    this._panel()!.nativeElement.scrollTo({ top })
  }

  /** Finds and selects an option whose value equals the passed one. */
  public _selectOptionByValue(value: unknown, emitEvent = true): void {
    if (value == null) return this._deselectAll()

    const optionToSelect = this.options().find(option => {
      return this.displayWith()(option.value()) === this.displayWith()(value)
    })

    !optionToSelect?.isSelected() && optionToSelect?.select(emitEvent)
  }

  public _deselectAll(except?: CkOption): void {
    this.options().forEach(
      option => option !== except && option.deselect(false),
    )
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
    this._animationState.set('open')
    this.opened.emit()
  }

  public _close(): void {
    this._trigger.set(null)
    this._animationState.set('closed')
    !this.selectedOption() && this._resetActiveOption()
    this.closed.emit()
  }

  protected _getAriaLabelledby(labelId: string): string | null {
    if (this.ariaLabel()) return null
    if (!this.ariaLabelledby()) return labelId
    if (labelId) return `${labelId} ${this.ariaLabelledby()}`

    return this.ariaLabelledby() ?? null
  }

  private _resetActiveOption(): void {
    let resetToIndex = this.options().indexOf(this.selectedOption()!)

    if (!this.selectedOption() && this.autoActiveFirstOption()) {
      resetToIndex = this.options().findIndex(option => !option.disabled)
    }

    this._keyManager.setActiveItem(resetToIndex)
  }

  /**
   * Runs when the suggestion panel opens.
   *
   * Marks selected option as active and scrolls it into view.
   */
  private _openEffect(): void {
    if (!this.isOpen()) return

    untracked(
      () => this.selectedOption() && this._navigate(this.selectedOption()!),
    )
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
