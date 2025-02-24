import {
  CdkCellDef,
  CdkFooterCellDef,
  CdkHeaderCellDef,
} from '@angular/cdk/table'
import { Directive } from '@angular/core'

@Directive({
  standalone: true,
  selector: '[ckHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: CkHeaderCellDef }],
})
export class CkHeaderCellDef extends CdkHeaderCellDef {}

@Directive({
  standalone: true,
  selector: '[ckCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: CkCellDef }],
})
export class CkCellDef extends CdkCellDef {}

@Directive({
  standalone: true,
  selector: '[ckFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: CkFooterCellDef }],
})
export class CkFooterCellDef extends CdkFooterCellDef {}
