import { Directive, ElementRef } from '@angular/core'

@Directive({
  selector: '[ckAutocompleteOrigin], ck-autocomplete-origin',
  exportAs: 'ckAutocompleteOrigin',
  standalone: true
})
export class CkAutocompleteOrigin {
  constructor(public readonly host: ElementRef<HTMLElement>) {}
}
