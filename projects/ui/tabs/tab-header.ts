import { ChangeDetectionStrategy, Component } from '@angular/core'

import { headerContainerStyles } from './styles'

@Component({
  selector: 'ck-tab-header',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tablist',
    class: headerContainerStyles,
  },
})
export class CkTabHeader {
  public readonly headerContainerStyles = headerContainerStyles
}
