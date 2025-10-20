import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core'

import { classNames } from '@corekit/ui/utils'

@Component({
  selector: 'ck-popover',
  imports: [],
  templateUrl: './popover.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hidden',
  },
})
export class CkPopover {
  public readonly class = input<string>()

  public readonly _template =
    viewChild.required<TemplateRef<unknown>>('template')

  protected readonly _class = computed(() => {
    return classNames(
      'bg-white rounded-md border p-4 shadow-md outline-hidden w-72',
      this.class(),
    )
  })
}
