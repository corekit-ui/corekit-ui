import { animate, state, style, transition, trigger } from '@angular/animations'
import {
  CK_DEFAULT_TRANSITION_DURATION,
  CK_DEFAULT_TRANSITION_TIMING_FUNCTION,
} from '@corekit/ui/animations'

export const ZOOM_IN_ANIMATION = trigger('zoomIn', [
  state(
    'closed',
    style({ opacity: 0, transform: 'scale(.95) translateY(-.5rem)' }),
  ),
  state('open', style({ opacity: 1, transform: 'scale(1)' })),
  transition(
    'open <=> closed',
    animate(
      `${CK_DEFAULT_TRANSITION_DURATION} ${CK_DEFAULT_TRANSITION_TIMING_FUNCTION}`,
    ),
  ),
])
