import { CDK_ACCORDION, CdkAccordionItem } from '@angular/cdk/accordion'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { CONTENT_EXPANSION } from '../../animations/content-expansion.animation'
import { CkAccordion } from '../../directives/accordion'

export const accordionItem = 'block border-b'

@Component({
  selector: 'ck-accordion-item, [ckAccordionItem]',
  exportAs: 'ckAccordionItem',
  standalone: true,
  templateUrl: './accordion-item.html',
  host: {
    '[class]': '_class',
    '[attr.aria-expanded]': 'expanded'
  },
  animations: [CONTENT_EXPANSION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
    // registering to the same accordion.
    { provide: CDK_ACCORDION, useExisting: CkAccordion }
  ]
})
export class CkAccordionItem extends CdkAccordionItem {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(accordionItem, this.class())
  }
}
