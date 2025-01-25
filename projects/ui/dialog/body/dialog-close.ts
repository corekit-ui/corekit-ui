import { NgTemplateOutlet } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  Optional,
  TemplateRef,
} from '@angular/core'
import { CkDialogRef } from '../dialog-ref'
import { dialogCloseStyles } from './dialog-close.styles'

@Component({
  selector: '[ckDialogClose]',
  exportAs: 'ckDialogClose',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './dialog-close.html',
  host: { '[class]': '_class()', '(click)': 'close()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkDialogClose {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly result = input<any>(undefined, { alias: 'ckDialogClose' })

  public readonly isIcon = input<boolean, unknown>(false, {
    alias: 'displayAsIcon',
    transform: booleanAttribute,
  })

  public readonly iconTemplate =
    contentChild<TemplateRef<unknown>>('iconTemplate')

  protected readonly _class = computed(() => {
    return dialogCloseStyles({ displayAsIcon: this.isIcon() })
  })

  constructor(@Optional() private readonly _dialogRef: CkDialogRef) {}

  public close(): void {
    this._dialogRef.close(this.result())
  }
}
