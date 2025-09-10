import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { MenuComponent } from '../components/menu/menu.component'

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative flex min-h-svh flex-col',
  },
})
export class LayoutComponent {}
