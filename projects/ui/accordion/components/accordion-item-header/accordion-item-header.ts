import { Component, booleanAttribute, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { CkAccordionItem } from '../accordion-item/accordion-item'

export const accordionItemHeader =
  'py-3 gap-2 flex items-center w-full text-start text-base leading-relaxed font-medium [&:is([disabled])]:opacity-50 [&:is([disabled])]:pointer-events-none hover:underline underline-offset-2'

// OnPush change detection is not possible in this case
// due to changes not picking up when another item toggled
// in single mode
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'ck-accordion-item-header, [ckAccordionItemHeader]',
  exportAs: 'ckAccordionItemHeader',
  standalone: true,
  templateUrl: './accordion-item-header.html',
  host: {
    role: 'button',
    '[class]': '_class',
    '[tabindex]': '_accordionItem.disabled ? -1 : 0',
    '[id]': "_accordionItem.id + '-header'",
    '[attr.aria-controls]': '_accordionItem.id',
    '[attr.disabled]': '_accordionItem.disabled ? "" : null',
    '(click)': '_accordionItem.toggle()',
    '(keydown.space)': '$event.preventDefault(); _accordionItem.toggle()',
    '(keydown.enter)': '$event.preventDefault(); _accordionItem.toggle()',
    '(keydown.arrowright)': '_accordionItem.open()',
    '(keydown.arrowleft)': '_accordionItem.close()'
  }
})
export class CkAccordionItemHeader {
  public readonly class = input<string>()

  /**
   * Whether the expansion indicator should be hidden.
   */
  public readonly hideToggle = input<boolean, unknown>(false, {
    transform: booleanAttribute
  })

  protected get _class(): string {
    return classNames(accordionItemHeader, this.class())
  }

  constructor(protected readonly _accordionItem: CkAccordionItem) {}
}
