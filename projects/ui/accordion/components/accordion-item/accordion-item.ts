import { CDK_ACCORDION, CdkAccordionItem } from '@angular/cdk/accordion'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { CkAccordion } from '../../directives/accordion'

export const accordionItem =
  'block border-b [&[aria-expanded="true"]]:pb-3 transition-[padding-bottom]'

@Component({
  selector: 'ck-accordion-item, [ckAccordionItem]',
  exportAs: 'ckAccordionItem',
  standalone: true,
  templateUrl: './accordion-item.html',
  host: {
    '[class]': '_class()',
    '[attr.aria-expanded]': 'expanded',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
    // registering to the same accordion.
    { provide: CDK_ACCORDION, useExisting: CkAccordion },
  ],
})
export class CkAccordionItem extends CdkAccordionItem {
  public readonly class = input<string>()

  protected readonly _class = computed(() => {
    return classNames(accordionItem, this.class())
  })
}
