import { Overlay, ScrollStrategy } from '@angular/cdk/overlay'
import { InjectionToken, inject } from '@angular/core'

/**
 * Sets scroll strategy for select dropdown panel.
 *
 * Holds a factory rather than a strategy instance: a `ScrollStrategy` can only
 * ever be attached to a single overlay, so every select has to get its own.
 */
export const CK_SELECT_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>('CK_SELECT_SCROLL_STRATEGY', {
  providedIn: 'root',
  factory: (): (() => ScrollStrategy) => {
    const overlay = inject(Overlay)

    return (): ScrollStrategy => overlay.scrollStrategies.reposition()
  },
})
