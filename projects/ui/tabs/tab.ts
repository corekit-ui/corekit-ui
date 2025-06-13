import { TemplatePortal } from '@angular/cdk/portal'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core'

import { CkTabContent } from './tab-content'
import { CkTabLabel } from './tab-label'
import { CkTabGroup } from './tab-group'

@Component({
  selector: 'ck-tab',
  template: `
    <ng-template><ng-content /></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'null',
  },
})
export class CkTab {
  public readonly textLabel = input<string>('', { alias: 'label' })
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  })

  /** Aria label for the tab. */
  public readonly ariaLabel = input<string | null>(null, {
    alias: 'aria-label',
  })

  /**
   * Reference to the element that the tab is labelled by.
   * Will be cleared if `aria-label` is set at the same time.
   */
  public readonly ariaLabelledby = input<string | null>(null, {
    alias: 'aria-labelledby',
  })

  /** Content for the tab label given by `<ng-template ck-tab-label>`. */
  public readonly templateLabel = contentChild(CkTabLabel)

  public _closestTabGroup = inject(CkTabGroup, { optional: true })

  /**
   * The relatively indexed position where 0 represents the center, negative is left, and positive
   * represents the right.
   */
  public position: number | null = null

  /**
   * Whether the tab is currently active.
   */
  public readonly isActive = signal(false)

  public readonly content = computed(() => {
    const explicit = this._explicitContent()
    const implicit = this._implicitContent()
    const template = explicit ?? implicit

    return template && new TemplatePortal(template, this._viewContainerRef)
  })

  private readonly _explicitContent = contentChild(CkTabContent, {
    read: TemplateRef,
  })

  private readonly _implicitContent = viewChild(TemplateRef)
  private readonly _viewContainerRef = inject(ViewContainerRef)
}
