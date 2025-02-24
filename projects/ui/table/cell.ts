import { CdkCell, CdkFooterCell, CdkHeaderCell } from '@angular/cdk/table'
import { computed, Directive, input } from '@angular/core'

import { classNames } from '@corekit/ui/utils'

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

  protected readonly _class = computed(() =>
    classNames(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
      this.class(),
    ),
  )
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

  protected readonly _class = computed(() =>
    classNames('p-4 align-middle', this.class()),
  )
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

  protected readonly _class = computed(() =>
    classNames('p-4 align-middle', this.class()),
  )
}
