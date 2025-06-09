import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  output,
  QueryList,
  viewChildren,
} from '@angular/core'
import { Platform } from '@angular/cdk/platform'
import { CdkPortalOutlet } from '@angular/cdk/portal'

import { CkTabHeader } from './tab-header'
import { CkTab } from './tab'
import { CkTabBody } from './tab-body'
import { CkTabLabelWrapper } from './tab-label-wrapper'

export interface CkTabChangeEvent {
  /** Index of the currently-selected tab. */
  readonly index: number
  /** Reference to the currently-selected tab. */
  readonly tab: CkTab
}

@Component({
  selector: 'ck-tab-group',
  templateUrl: './tab-group.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CkTabHeader, CkTabBody, CdkPortalOutlet, CkTabLabelWrapper],
})
export class CkTabGroup {
  public readonly selectedIndex = input<number, unknown>(0, {
    transform: numberAttribute,
  })

  public readonly contentTabIndex = input<number | null, unknown>(null, {
    transform: numberAttribute,
  })

  /** Aria label of the inner `tablist` of the group. */
  public readonly ariaLabel = input<string | null>(null, {
    alias: 'aria-label',
  })

  /** Sets the `aria-labelledby` of the inner `tablist` of the group. */
  public readonly ariaLabelledby = input<string | null>(null, {
    alias: 'aria-labelledby',
  })

  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  public readonly selectedIndexChange = output<CkTabChangeEvent>()

  public _tabs = new QueryList<CkTab>()

  protected _isServer = !inject(Platform).isBrowser
  protected readonly _selectedIndex = linkedSignal(() => this.selectedIndex())

  private readonly _cdr = inject(ChangeDetectorRef)

  private readonly _allTabs = contentChildren(CkTab, { descendants: true })
  private readonly _tabBodies = viewChildren(CkTabBody)

  constructor() {
    effect(this._allTabsChangesEffect.bind(this))
    effect(this._setActiveTabEffect.bind(this))
  }

  /** Handle click events, setting new selected index if appropriate. */
  public _tabClick(tab: CkTab, index: number): void {
    if (!tab.disabled()) {
      this._selectedIndex.set(index)
      this.selectedIndexChange.emit(this._createChangeEvent(index))
    }
  }

  /**
   * Callback invoked when the centered state of a tab body changes.
   * @param isCenter Whether the tab will be in the center.
   */
  protected _setActiveTabEffect(): void {
    this._tabBodies().forEach((body, index) => {
      body._isActive.set(index === this._selectedIndex())
    })
    this._cdr.markForCheck()
  }

  private _allTabsChangesEffect(): void {
    const tabs = this._allTabs()

    this._tabs.reset(
      tabs.filter(tab => {
        return tab._closestTabGroup === this || !tab._closestTabGroup
      }),
    )
    this._tabs.notifyOnChanges()
  }

  private _createChangeEvent(index: number): CkTabChangeEvent {
    const tab = this._tabs.toArray()[index]

    return {
      index,
      tab,
    }
  }
}
