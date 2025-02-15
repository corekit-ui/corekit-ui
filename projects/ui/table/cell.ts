import { CdkCell, CdkFooterCell, CdkHeaderCell } from '@angular/cdk/table'
import { Directive, input } from '@angular/core'
import { cva } from 'class-variance-authority'

import { classNames } from '@corekit/ui/utils'

export const headerCellStyles = cva(
  'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
)
export const cellStyles = cva('p-4 align-middle')
export const footerCellStyles = cva('p-4 align-middle')

@Directive({
  standalone: true,
  selector: 'ck-header-cell, th[ck-header-cell]',
  host: {
    role: 'columnheader',
    '[class]': '_class',
  },
})
export class CkHeaderCell extends CdkHeaderCell {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(headerCellStyles(), this.class())
  }
}

@Directive({
  standalone: true,
  selector: 'ck-cell, td[ck-cell]',
  host: {
    '[class]': '_class',
  },
})
export class CkCell extends CdkCell {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(cellStyles(), this.class())
  }
}

@Directive({
  standalone: true,
  selector: 'ck-footer-cell, td[ck-footer-cell]',
  host: {
    '[class]': '_class',
  },
})
export class CkFooterCell extends CdkFooterCell {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(footerCellStyles(), this.class())
  }
}
