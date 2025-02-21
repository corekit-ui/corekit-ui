import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-typography-page',
  imports: [NgOptimizedImage],
  templateUrl: './typography-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block ck-typography' },
})
export class TypographyPageComponent {}
