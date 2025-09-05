import { CdkScrollable } from '@angular/cdk/scrolling'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  TemplateRef,
} from '@angular/core'

import { classNames } from '@corekit/ui/utils'
import { tabBodyStyles } from './tab-body.styles'
import { NgTemplateOutlet } from '@angular/common'

@Component({
  selector: 'ck-tab-body',
  template: `
    <ng-template *ngTemplateOutlet="content()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    '[class]': '_class()',
    '[class.visible]': 'isActive()',
    '[class.invisible]': '!isActive()',
  },
  hostDirectives: [CdkScrollable],
})
export class CkTabBody {
  public readonly class = input<string>()

  /** The tab body content to display. */
  public readonly content = input<TemplateRef<unknown> | null>(null)

  public readonly isActive = signal<boolean>(false)

  protected readonly _class = computed(() => {
    return classNames(
      tabBodyStyles({
        state: this.isActive() ? 'active' : 'default',
      }),
      this.class(),
    )
  })
}
