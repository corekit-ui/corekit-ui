import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal'
import { CdkScrollable } from '@angular/cdk/scrolling'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core'
import { cva } from 'class-variance-authority'

import { classNames } from '@corekit/ui/utils'

@Directive({ selector: '[ckTabBodyHost]' })
export class CkTabBodyPortal
  extends CdkPortalOutlet
  implements OnInit, OnDestroy
{
  private readonly _host = inject(CkTabBody)

  /** Set initial visibility or set up subscription for changing visibility. */
  public override ngOnInit(): void {
    super.ngOnInit()

    this.attach(this._host.content())
  }

  /** Clean up centering subscription. */
  public override ngOnDestroy(): void {
    super.ngOnDestroy()
  }
}

const styles = cva(['basis-full'], {
  variants: {
    state: {
      default: 'absolute inset-0 overflow-hidden',
      active: 'relative overflow-x-hidden overflow-y-auto grow z-[1]',
    },
  },
})

@Component({
  selector: 'ck-tab-body',
  templateUrl: './tab-body.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CkTabBodyPortal, CdkScrollable],
  host: {
    '[class]': '_class()',
  },
})
export class CkTabBody {
  public readonly class = input<string>()

  /** The tab body content to display. */
  public readonly content = input<TemplatePortal | null>(null)

  /** The shifted index position of the tab body, where zero represents the active center tab. */
  public readonly position = input<number>()

  public readonly _isActive = signal<boolean>(false)

  protected _class = computed(() => {
    return classNames(
      styles({
        state: this._isActive() ? 'active' : 'default',
      }),
      this.class(),
    )
  })
}
