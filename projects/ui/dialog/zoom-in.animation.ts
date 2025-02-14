import { animate, state, style, transition, trigger } from '@angular/animations'
import {
  transitionDuration,
  transitionTimingFunction,
} from 'tailwindcss/defaultTheme'

export const ZOOM_IN = trigger('zoomIn', [
  state(
    'void, closing, closed',
    style({ opacity: 0, transform: 'scale(.95) translateY(.5rem)' }),
  ),
  state('*, opening, opened', style({ opacity: 1, transform: 'scale(1)' })),
  transition(
    '* <=> void, opened <=> closing',
    animate(
      `${transitionDuration.DEFAULT} ${transitionTimingFunction.DEFAULT}`,
    ),
  ),
])
