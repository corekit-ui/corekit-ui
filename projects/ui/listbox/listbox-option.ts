import { NgClass } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { CdkOption } from '@angular/cdk/listbox'
import { cva } from 'class-variance-authority'

import { classNames } from '@corekit/ui/utils'

const styles = cva([
  'relative',
  'flex',
  'gap-2',
  'cursor-pointer',
  'select-none',
  'items-center',
  'rounded-sm',
  'px-2',
  'py-1.5',
  'text-sm',
  'outline-hidden',
  'motion-safe:transition-colors',
  'hover:bg-muted',
])

@Component({
  selector: 'ck-listbox-option',
  exportAs: 'ckListboxOption',
  imports: [NgClass],
  templateUrl: './listbox-option.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[class]': '_class()',
    '[class.bg-muted]': 'isSelected()',
  },
  providers: [
    {
      provide: CdkOption,
      useExisting: CkListboxOption,
    },
  ],
  inputs: ['value'],
})
export class CkListboxOption<T = unknown> extends CdkOption<T> {
  public readonly class = input<string>()

  protected readonly _class = computed(() => classNames(styles(), this.class()))
}
