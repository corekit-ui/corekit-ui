import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core'

import { CkTabNavPanel } from './tab-nav-panel'
import { headerContainerStyles } from '../styles'

@Component({
  selector: '[ck-tab-nav-bar]',
  exportAs: 'ckTabNavBar, ckTabNav',
  templateUrl: './tab-nav-bar.html',
  host: {
    '[class]': 'classes',
    '[attr.role]': '_getRole()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkTabNav {
  public readonly tabPanel = input<CkTabNavPanel>()

  public readonly classes = headerContainerStyles

  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  protected _getRole(): string | null {
    return this.tabPanel()
      ? 'tablist'
      : this._elementRef.nativeElement.getAttribute('role')
  }
}
