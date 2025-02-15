import {
  CdkCellOutlet,
  CdkFooterRow,
  CdkHeaderRow,
  CdkRow,
} from '@angular/cdk/table'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { cva } from 'class-variance-authority'

import { classNames } from '@corekit/ui/utils'

export const headerRowStyles = cva('border-b')
export const rowStyles = cva('border-b transition-colors hover:bg-muted/50')
export const footerRowStyles = cva('border-b')

const ROW_TEMPLATE = `<ng-container cdkCellOutlet />`

@Component({
  standalone: true,
  selector: 'ck-header-row, tr[ck-header-row]',
  exportAs: 'ckHeaderRow',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
    '[class]': '_class',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkHeaderRow, useExisting: CkHeaderRow }],
  imports: [CdkCellOutlet],
})
export class CkHeaderRow extends CdkHeaderRow {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(headerRowStyles(), this.class())
  }
}

@Component({
  standalone: true,
  selector: 'ck-row, tr[ck-row]',
  exportAs: 'ckRow',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
    '[class]': '_class',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkRow, useExisting: CkRow }],
  imports: [CdkCellOutlet],
})
export class CkRow extends CdkRow {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(rowStyles(), this.class())
  }
}

@Component({
  standalone: true,
  selector: 'ck-footer-row, tr[ck-footer-row]',
  exportAs: 'ckFooterRow',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
    '[class]': '_class',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: CdkFooterRow, useExisting: CkFooterRow }],
  imports: [CdkCellOutlet],
})
export class CkFooterRow extends CdkFooterRow {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(footerRowStyles(), this.class())
  }
}
