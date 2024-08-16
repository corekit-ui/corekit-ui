import { animate, state, style, transition, trigger } from '@angular/animations'
import { DEFAULT_DURATION, DEFAULT_EASING } from '@corekit/ui/animations'

export const FADE_IN_DOWN = trigger('fadeInDown', [
  state('void', style({ opacity: 0, transform: 'translateY(-50%)' })),
  state('*', style({ opacity: 1, transform: 'translateY(0)' })),
  transition('void <=> *', [animate(`${DEFAULT_DURATION} ${DEFAULT_EASING}`)])
])