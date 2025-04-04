import { ChangeDetectionStrategy, Component, model } from '@angular/core'
import { JsonPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { CkListbox } from '@corekit/ui/listbox'
import { CkOption } from '@corekit/ui/option'
import { CkCheckbox } from '@corekit/ui/checkbox'

@Component({
  selector: 'app-listbox-page',
  standalone: true,
  imports: [CkListbox, CkOption, CkCheckbox, FormsModule, JsonPipe],
  templateUrl: './listbox-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxPageComponent {
  public multiple = model(true)
  public disabled = model(false)
  public selected = model(['angular', 'vue'])

  public readonly options = [
    { value: 'angular', label: 'Angular', disabled: false },
    { value: 'react', label: 'React', disabled: false },
    { value: 'vue', label: 'Vue', disabled: false },
    { value: 'svelte', label: 'Svelte', disabled: true },
    { value: 'solid', label: 'Solid', disabled: false },
  ]
}
