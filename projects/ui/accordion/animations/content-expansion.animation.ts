import { animate, state, style, transition, trigger } from '@angular/animations'

export const CONTENT_EXPANSION = trigger('contentExpansion', [
  state(
    'collapsed',
    style({
      height: 0,
      opacity: 0,
      transform: 'translateY(-.75rem)',
      visibility: 'hidden'
    })
  ),
  state(
    'expanded',
    style({
      height: '*',
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)'
    })
  ),
  transition(
    'expanded <=> collapsed',
    animate('.25s cubic-bezier(0.25, 1, 0.5, 1)')
  )
])
