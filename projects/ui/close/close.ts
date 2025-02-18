import { NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { CK_CLOSABLE, CkClosable } from './closable'
import { CkCloseAppearance, closeStyles } from './close.styles'

@Component({
  selector: '[ck-close]',
  exportAs: 'ckClose',
  imports: [NgTemplateOutlet],
  templateUrl: './close.html',
  host: { '[class]': '_class()', '(click)': 'close()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkClose implements CkClosable {
  public readonly class = input<string>()

  /**
   * Applies predefined styling depending on the value:
   *
   * - `native` – no additional styling
   * - `icon` – a generic closing button with default icon content
   */
  public readonly appearance = input<CkCloseAppearance>('native', {
    alias: 'ckCloseAppearance',
  })

  /** Data to be emitted to the component opener when the component closes. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly result = input<any>(undefined, { alias: 'ck-close' })

  protected readonly _class = computed(() => {
    return classNames(
      closeStyles({ appearance: this.appearance() }),
      this.class(),
    )
  })

  protected readonly _hasProjectedContent = computed(() => {
    const childNodes = this._contentTemplateRef().createEmbeddedView(null)
      .rootNodes as ChildNode[]

    return !!childNodes.length
  })

  private readonly _contentTemplateRef = viewChild.required('content', {
    read: TemplateRef<unknown>,
  })

  constructor(@Inject(CK_CLOSABLE) private readonly _closable: CkClosable) {}

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  public close(result = this.result()): void {
    this._closable.close(result)
  }
}
