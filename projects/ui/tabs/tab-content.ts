import { Directive, TemplateRef, inject } from '@angular/core'

/** Decorates the `ng-template` tags and reads out the template from it. */
@Directive({
  selector: '[ckTabContent]',
})
export class CkTabContent {
  public readonly template = inject<TemplateRef<unknown>>(TemplateRef)
}
