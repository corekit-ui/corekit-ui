import { ChangeDetectionStrategy, Component, model } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { CkListbox, CkListboxOption } from '@corekit/ui/listbox'
import { CkCheckbox } from '@corekit/ui/checkbox'

@Component({
  selector: 'app-listbox-page',
  standalone: true,
  imports: [CkListbox, CkListboxOption, CkCheckbox, FormsModule],
  templateUrl: './listbox-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxPageComponent {
  public disabled = model(false)

  public readonly options = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid' },
  ]
}
