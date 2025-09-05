import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core'
import { _IdGenerator } from '@angular/cdk/a11y'

import { classNames } from '@corekit/ui/utils'
import { CkTabNav } from './tab-nav-bar'
import { labelWrapperStyles } from '../styles'

@Component({
  selector: '[ck-tab-link], [ckTabLink]',
  exportAs: 'ckTabLink',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab-link.html',
  host: {
    '[class]': '_class()',
    '[attr.tabIndex]': 'tabIndex()',
    '[attr.role]': '_getRole()',
    '[attr.aria-controls]': '_getAriaControls()',
    '[attr.aria-current]': '_getAriaCurrent()',
    '[attr.aria-selected]': '_getAriaSelected()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.id]': 'id()',
  },
})
export class CkTabLink {
  /** Unique id for the tab. */
  public readonly id = input<string>(inject(_IdGenerator).getId('ck-tab-link-'))
  public readonly tabIndex = input<number | null>(null)

  public readonly active = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /** Whether the tab is disabled. */
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  private readonly _class = computed(() =>
    classNames(
      labelWrapperStyles({ state: this.active() ? 'active' : 'default' }),
    ),
  )

  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly _tabNavBar = inject(CkTabNav)

  protected _getRole(): string | null {
    return this._tabNavBar.tabPanel()
      ? 'tab'
      : this._elementRef.nativeElement.getAttribute('role')
  }

  protected _getAriaControls(): string | undefined | null {
    return this._tabNavBar.tabPanel()
      ? this._tabNavBar.tabPanel()?.id()
      : this._elementRef.nativeElement.getAttribute('aria-controls')
  }

  protected _getAriaCurrent(): string | null {
    return this.active() && !this._tabNavBar.tabPanel() ? 'page' : null
  }

  protected _getAriaSelected(): string | null {
    if (this._tabNavBar.tabPanel()) {
      return this.active() ? 'true' : 'false'
    }

    return this._elementRef.nativeElement.getAttribute('aria-selected')
  }
}
