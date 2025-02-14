import { ChangeDetectionStrategy, Component } from '@angular/core'

import { CkListbox } from '@corekit/ui/listbox'

@Component({
  selector: 'app-listbox-page',
  standalone: true,
  imports: [CkListbox],
  templateUrl: './listbox-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxPageComponent {}
