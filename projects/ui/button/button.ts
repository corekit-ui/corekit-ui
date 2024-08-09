import { Directive } from '@angular/core'

@Directive({
  selector: '[ckButton]',
  standalone: true,
  host: { class: 'bg-red-300' }
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CkButton {}
