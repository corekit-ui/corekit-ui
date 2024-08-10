import { CDK_ACCORDION, CdkAccordion } from '@angular/cdk/accordion'
import { Directive, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

export const accordion = 'block'

@Directive({
  selector: 'ck-accordion, [ckAccordion]',
  exportAs: 'ckAccordion',
  standalone: true,
  providers: [{ provide: CDK_ACCORDION, useExisting: CkAccordion }],
  host: { '[class]': '_class' }
})
export class CkAccordion extends CdkAccordion {
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(accordion, this.class())
  }
}
