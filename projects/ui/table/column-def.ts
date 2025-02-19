import { CdkColumnDef } from '@angular/cdk/table'
import { Directive } from '@angular/core'

@Directive({
  standalone: true,
  selector: '[ckColumnDef]',
  providers: [{ provide: CdkColumnDef, useExisting: CkColumnDef }],
  inputs: [{ name: 'name', alias: 'ckColumnDef' }],
})
export class CkColumnDef extends CdkColumnDef {}
