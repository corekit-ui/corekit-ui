import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
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

import { classNames } from '@corekit/ui/utils'

@Component({
  standalone: true,
  selector: 'ck-table, table[ck-table]',
  exportAs: 'ckTable',
  templateUrl: './table.html',
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
    '[class]': '_class()',
  },
})
export class CkTable<T> extends CdkTable<T> {
  public readonly class = input<string>()

  protected readonly _class = computed(() => classNames('w-full', this.class()))

  protected override stickyCssClass = 'sticky'
  protected override needsPositionStickyOnElement = false
}
