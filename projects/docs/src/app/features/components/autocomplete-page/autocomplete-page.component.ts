import { JsonPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CkAutocomplete, CkAutocompleteTrigger } from '@corekit/ui/autocomplete'
import { CkCheckbox } from '@corekit/ui/checkbox'
import { CkFormField } from '@corekit/ui/form-field'
import { CkInput, CkInputPrefix } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'
import { CkOption } from '@corekit/ui/option'
import { CkCode } from '@corekit/ui/typography'
import { LucideAngularModule } from 'lucide-angular'

type Framework = { name: string; stars: number; disabled: boolean; id: string }

const frameworks: Framework[] = [
  { name: 'Angular', stars: 95700, disabled: false, id: 'angular-id' },
  { name: 'Analog.js', stars: 2500, disabled: false, id: 'analogjs-id' },
  { name: 'Vue', stars: 22800, disabled: false, id: 'vue-id' },
  { name: 'React', stars: 22800, disabled: true, id: 'react-id' },
  { name: 'Next.js', stars: 208000, disabled: false, id: 'nextjs-id' },
  { name: 'Astro', stars: 45700, disabled: false, id: 'astro-id' },
]

@Component({
  selector: 'app-autocomplete-page',
  standalone: true,
  imports: [
    CkOption,
    CkAutocomplete,
    CkAutocompleteTrigger,
    ReactiveFormsModule,
    CkLabel,
    CkInput,
    CkInputPrefix,
    CkFormField,
    CkCheckbox,
    FormsModule,
    LucideAngularModule,
    JsonPipe,
    CkCode,
  ],
  templateUrl: './autocomplete-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-3' },
})
export class AutocompletePageComponent {
  public readonly requireSelection = signal(true)
  public readonly autoActiveFirstOption = signal(true)
  public readonly query = signal<string>('')
  public readonly frameworkId = signal<string | undefined>(undefined)

  public readonly frameworks = computed(() => {
    const query = this.query().trim().toLowerCase()

    return frameworks.filter(({ name, stars }) => {
      return `${name} (${this._numberFormatter(stars)} stars)`
        .toLowerCase()
        .includes(query)
    })
  })

  public readonly selectedOption = computed(() => {
    return frameworks.find(option => option.id === this.frameworkId())
  })

  private readonly _numberFormatter = Intl.NumberFormat('en', {
    notation: 'compact',
  }).format

  public readonly displayWith = (id: string | null): string => {
    if (!id) return ''

    const option = frameworks.find(framework => framework.id === id)!

    return `${option.name} (${this._numberFormatter(option.stars)} stars)`
  }
}
