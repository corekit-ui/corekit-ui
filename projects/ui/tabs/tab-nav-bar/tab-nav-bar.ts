import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core'

import { CkTabNavPanel } from './tab-nav-panel'
import { headerContainerStyles } from '../styles'
import { classNames } from '@corekit/ui/utils'

@Component({
  selector: '[ck-tab-nav-bar]',
  exportAs: 'ckTabNavBar, ckTabNav',
  templateUrl: './tab-nav-bar.html',
  host: {
    '[class]': '_class()',
    '[attr.role]': '_getRole()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkTabNav {
  public readonly class = input<string>()
  public readonly tabPanel = input<CkTabNavPanel>()

  public readonly classes = headerContainerStyles

  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  protected readonly _class = computed(() => {
    return classNames(headerContainerStyles, this.class())
  })

  protected _getRole(): string | null {
    return this.tabPanel()
      ? 'tablist'
      : this._elementRef.nativeElement.getAttribute('role')
  }
}
