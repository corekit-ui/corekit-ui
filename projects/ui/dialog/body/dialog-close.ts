import { Directive, input, Optional } from '@angular/core'
import { CkDialogRef } from '../dialog-ref'

@Directive({
  selector: '[ckDialogClose]',
  exportAs: 'ckDialogClose',
  standalone: true,
  host: { '(click)': 'close()' }
})
export class CkDialogClose {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly result = input<any>(undefined, { alias: 'ckDialogClose' })

  constructor(@Optional() private readonly _dialogRef: CkDialogRef) {}

  public close(): void {
    this._dialogRef.close(this.result())
  }
}
