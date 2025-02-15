import { booleanAttribute, Directive } from '@angular/core'
import { CdkFooterRowDef, CdkHeaderRowDef, CdkRowDef } from '@angular/cdk/table'

@Directive({
  standalone: true,
  selector: '[ckHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: CkHeaderRowDef }],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [
    { name: 'columns', alias: 'ckHeaderRowDef' },
    {
      name: 'sticky',
      alias: 'ckHeaderRowDefSticky',
      transform: booleanAttribute,
    },
  ],
})
export class CkHeaderRowDef extends CdkHeaderRowDef {}

@Directive({
  standalone: true,
  selector: '[ckRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: CkRowDef }],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [
    { name: 'columns', alias: 'ckRowDefColumns' },
    { name: 'when', alias: 'ckRowDefWhen' },
  ],
})
export class CkRowDef<T> extends CdkRowDef<T> {}

@Directive({
  standalone: true,
  selector: '[ckFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: CkFooterRowDef }],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [
    { name: 'columns', alias: 'ckFooterRowDef' },
    {
      name: 'sticky',
      alias: 'ckFooterRowDefSticky',
      transform: booleanAttribute,
    },
  ],
})
export class CkFooterRowDef extends CdkFooterRowDef {}
