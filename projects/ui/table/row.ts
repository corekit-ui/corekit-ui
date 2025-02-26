import {
  CdkCellOutlet,
  CdkFooterRow,
  CdkHeaderRow,
  CdkRow,
} from '@angular/cdk/table'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

import { classNames } from '@corekit/ui/utils'

const ROW_TEMPLATE = `<ng-container cdkCellOutlet />`

@Component({
  standalone: true,
  selector: 'ck-header-row, tr[ck-header-row]',
  exportAs: 'ckHeaderRow',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
    '[class]': '_class()',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkHeaderRow, useExisting: CkHeaderRow }],
  imports: [CdkCellOutlet],
})
export class CkHeaderRow extends CdkHeaderRow {
  public readonly class = input<string>()

  protected readonly _class = computed(() =>
    classNames('border-b', this.class()),
  )
}

@Component({
  standalone: true,
  selector: 'ck-row, tr[ck-row]',
  exportAs: 'ckRow',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
    '[class]': '_class()',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkRow, useExisting: CkRow }],
  imports: [CdkCellOutlet],
})
export class CkRow extends CdkRow {
  public readonly class = input<string>()

  protected readonly _class = computed(() =>
    classNames('border-b transition-colors hover:bg-muted/50', this.class()),
  )
}

@Component({
  standalone: true,
  selector: 'ck-footer-row, tr[ck-footer-row]',
  exportAs: 'ckFooterRow',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
    '[class]': '_class()',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkFooterRow, useExisting: CkFooterRow }],
  imports: [CdkCellOutlet],
})
export class CkFooterRow extends CdkFooterRow {
  public readonly class = input<string>()

  protected readonly _class = computed(() =>
    classNames(
      'bg-muted/50 border-b font-medium last:border-b-0',
      this.class(),
    ),
  )
}
