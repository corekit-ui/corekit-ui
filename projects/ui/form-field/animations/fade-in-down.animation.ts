import { animate, state, style, transition, trigger } from '@angular/animations'
import theme from 'tailwindcss/defaultTheme'

export const FADE_IN_DOWN = trigger('fadeInDown', [
  state('void', style({ opacity: 0, transform: 'translateY(-50%)' })),
  state('*', style({ opacity: 1, transform: 'translateY(0)' })),
  transition('void <=> *', [
    animate(
      `${theme.transitionDuration.DEFAULT} ${theme.transitionTimingFunction.DEFAULT}`,
    ),
  ]),
])
