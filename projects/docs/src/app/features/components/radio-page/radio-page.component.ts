import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild
} from '@angular/core'
import { CkLabel } from '@corekit/ui/label'
import { CkRadio } from '@corekit/ui/radio'

@Component({
  selector: 'app-radio-page',
  standalone: true,
  imports: [CkRadio, CkLabel],
  templateUrl: './radio-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-1' }
})
export class RadioPageComponent {
  private readonly _invalid = viewChild<unknown, ElementRef<HTMLInputElement>>(
    'invalid',
    { read: ElementRef }
  )

  constructor() {
    afterNextRender(() => {
      this._invalid()?.nativeElement.setCustomValidity('Error')
    })
  }
}
