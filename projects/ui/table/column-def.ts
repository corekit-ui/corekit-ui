import { CdkColumnDef } from '@angular/cdk/table'
import { Directive, Input } from '@angular/core'

@Directive({
  standalone: true,
  selector: '[ckColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: CkColumnDef },
    // {provide: 'CK_SORT_HEADER_COLUMN_DEF', useExisting: CkColumnDef},
  ],
})
export class CkColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('ckColumnDef')
  public override get name(): string {
    return this._name
  }

  public override set name(name: string) {
    this._setNameInput(name)
  }
}
