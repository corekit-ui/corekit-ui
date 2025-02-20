import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  CkAccordion,
  CkAccordionItem,
  CkAccordionItemHeader,
} from '@corekit/ui/accordion'

@Component({
  selector: 'app-accordion-page',
  imports: [CkAccordion, CkAccordionItem, CkAccordionItemHeader],
  templateUrl: './accordion-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class AccordionPageComponent {}
