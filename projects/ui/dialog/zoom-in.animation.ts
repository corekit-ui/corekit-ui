import { animate, state, style, transition, trigger } from '@angular/animations'
import {
  CK_DEFAULT_TRANSITION_DURATION,
  CK_DEFAULT_TRANSITION_TIMING_FUNCTION,
} from '@corekit/ui/animations'

export const ZOOM_IN = trigger('zoomIn', [
  state(
    'void, closing, closed',
    style({ opacity: 0, transform: 'scale(.95) translateY(.5rem)' }),
  ),
  state('*, opening, opened', style({ opacity: 1, transform: 'scale(1)' })),
  transition(
    '* <=> void, opened <=> closing',
    animate(
      `${CK_DEFAULT_TRANSITION_DURATION} ${CK_DEFAULT_TRANSITION_TIMING_FUNCTION}`,
    ),
  ),
])
