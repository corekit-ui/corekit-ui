import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { Appearance, badge, Color } from './badge.styles'

@Directive({
  selector: '[ckBadge], ck-badge',
  standalone: true,
  host: { '[class]': '_class' }
})
export class CkBadge {
  public readonly class = input<string>()

  /**
   * Badge color
   */
  public readonly color = input<Color>()

  /**
   * Whether to render a badge with colored background
   * or border
   */
  public readonly appearance = input<Appearance>()

  protected get _class(): string {
    return classNames(
      badge({ color: this.color(), appearance: this.appearance() }),
      this.class()
    )
  }
}
