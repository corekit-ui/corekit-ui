import { Overlay, ScrollStrategy } from '@angular/cdk/overlay'
import { inject, InjectionToken } from '@angular/core'

/**
 * Sets scroll strategy for the datepicker popup.
 *
 * Provides a factory rather than a strategy, because a scroll strategy
 * instance cannot be shared between overlays.
 */
export const CK_DATEPICKER_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>('CK_DATEPICKER_SCROLL_STRATEGY', {
  providedIn: 'root',
  factory: () => {
    const overlay = inject(Overlay)

    return (): ScrollStrategy => overlay.scrollStrategies.reposition()
  },
})
