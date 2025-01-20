import { animate, state, style, transition, trigger } from '@angular/animations'
import theme from 'tailwindcss/defaultTheme'

export const ZOOM_IN_ANIMATION = trigger('zoomIn', [
  state(
    'closed',
    style({ opacity: 0, transform: 'scale(.95) translateY(-.5rem)' }),
  ),
  state('open', style({ opacity: 1, transform: 'scale(1)' })),
  transition(
    'open <=> closed',
    animate(
      `${theme.transitionDuration.DEFAULT} ${theme.transitionTimingFunction.DEFAULT}`,
    ),
  ),
])
