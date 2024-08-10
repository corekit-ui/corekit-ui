import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  CkAccordion,
  CkAccordionItem,
  CkAccordionItemHeader
} from '@corekit/ui/accordion'
import { CkCode } from '@corekit/ui/typography'

@Component({
  selector: 'app-accordion-page',
  standalone: true,
  imports: [CkAccordion, CkAccordionItem, CkAccordionItemHeader, CkCode],
  templateUrl: './accordion-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class AccordionPageComponent {}
