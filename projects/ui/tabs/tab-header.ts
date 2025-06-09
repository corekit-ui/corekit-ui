import { ChangeDetectionStrategy, Component } from '@angular/core'

import { headerContainerStyles } from './styles'

@Component({
  selector: 'ck-tab-header',
  templateUrl: './tab-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkTabHeader {
  public readonly headerContainerStyles = headerContainerStyles
}
