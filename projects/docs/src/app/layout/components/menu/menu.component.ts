import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

import { CkButton } from '@corekit/ui/button'
import { COMPONENTS_MENU } from '../../tokens/menu.token'

@Component({
  selector: '[app-menu]',
  imports: [RouterLink, CkButton, RouterLinkActive],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col',
  },
})
export class MenuComponent {
  public readonly componentsMenu = inject(COMPONENTS_MENU)
}
