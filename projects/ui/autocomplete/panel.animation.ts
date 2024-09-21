// TODO: Reuse easing function and duration from tailwind config.

// TODO: Implement different transform origins depending on the panel position
//       relative to the trigger.

import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger
} from '@angular/animations'
import { DEFAULT_DURATION, DEFAULT_EASING } from '../animations'

export const PANEL_ANIMATION: AnimationTriggerMetadata = trigger(
  'panelAnimation',
  [
    state(
      'void, hidden',
      style({
        opacity: 0,
        transform: 'scale(0.95)',
        transformOrigin: 'center top'
      })
    ),
    transition(':enter, hidden => visible', [
      animate(
        `${DEFAULT_DURATION} ${DEFAULT_EASING}`,
        style({ opacity: 1, transform: 'scale(1)' })
      )
    ]),
    transition(':leave, visible => hidden', [
      animate(
        `${DEFAULT_DURATION} ${DEFAULT_EASING}`,
        style({ opacity: 0, transform: 'scale(0.95)' })
      )
    ])
  ]
)
