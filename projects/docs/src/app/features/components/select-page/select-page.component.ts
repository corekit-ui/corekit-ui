import { JsonPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { CkButton } from '@corekit/ui/button'
import { CkCheckbox } from '@corekit/ui/checkbox'
import { CkError, CkFormField } from '@corekit/ui/form-field'
import { CkLabel } from '@corekit/ui/label'
import { CkOption } from '@corekit/ui/option'
import { CkSelect } from '@corekit/ui/select'

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
  selector: 'app-select-page',
  imports: [
    CkSelect,
    CkOption,
    CkLabel,
    CkFormField,
    CkError,
    CkCheckbox,
    CkButton,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './select-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-3' },
})
export class SelectPageComponent {
  public readonly frameworks = frameworks

  public readonly disabled = signal(false)
  public readonly frameworkId = signal<string | null>(null)

  public readonly selectedFramework = computed(() => {
    return frameworks.find(framework => framework.id === this.frameworkId())
  })

  public readonly requiredFramework = new FormControl<string | null>(null, {
    validators: [Validators.required],
  })
}
