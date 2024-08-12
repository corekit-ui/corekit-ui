import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild
} from '@angular/core'
import { CkCheckbox } from '@corekit/ui/checkbox'
import { CkLabel } from '@corekit/ui/label'

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [CkCheckbox, CkLabel],
  templateUrl: './checkbox-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-1' }
})
export class CheckboxPageComponent implements AfterViewInit {
  private readonly _indeterminate = viewChild<
    unknown,
    ElementRef<HTMLInputElement>
  >('indeterminate', { read: ElementRef })

  public ngAfterViewInit(): void {
    const indeterminate = this._indeterminate()

    if (indeterminate) indeterminate.nativeElement.indeterminate = true
  }
}
