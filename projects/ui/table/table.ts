import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import {
  _COALESCED_STYLE_SCHEDULER,
  _CoalescedStyleScheduler,
  CDK_TABLE,
  CdkTable,
  DataRowOutlet,
  FooterRowOutlet,
  HeaderRowOutlet,
  NoDataRowOutlet,
  STICKY_POSITIONING_LISTENER,
} from '@angular/cdk/table'
import {
  _DisposeViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections'
import { cva } from 'class-variance-authority'

import { classNames } from '@corekit/ui/utils'

export const tableStyles = cva('w-full')
export const tFootStyles = cva(
  'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
)

@Component({
  standalone: true,
  selector: 'ck-table, table[ck-table]',
  exportAs: 'ckTable',
  // Note that according to MDN, the `caption` element has to be projected as the **first**
  // element in the table. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
  // We can't reuse `CDK_TABLE_TEMPLATE` because it's incompatible with local compilation mode.
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  template: `
    <ng-content select="caption" />
    <ng-content select="colgroup, col" />

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content />
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet />
      </thead>
      <tbody role="rowgroup">
        <ng-container rowOutlet />
        <ng-container noDataRowOutlet />
      </tbody>
      <tfoot role="rowgroup" [class]="_tFootClass">
        <ng-container footerRowOutlet />
      </tfoot>
    } @else {
      <ng-container headerRowOutlet />
      <ng-container rowOutlet />
      <ng-container noDataRowOutlet />
      <ng-container footerRowOutlet />
    }
  `,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
  providers: [
    { provide: CdkTable, useExisting: CkTable },
    { provide: CDK_TABLE, useExisting: CkTable },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
    // Abstract the view repeater strategy to a directive API so this code
    //  is only included in the build if used.
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy,
    },
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  host: {
    '[class]': '_class',
  },
})
export class CkTable<T> extends CdkTable<T> {
  public readonly class = input<string>()
  public readonly tFootClass = input<string>()

  protected get _class(): string {
    return classNames(tableStyles(), this.class())
  }

  protected get _tFootClass(): string {
    return classNames(tFootStyles(), this.tFootClass())
  }

  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected override stickyCssClass = 'sticky'

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement = false
}
