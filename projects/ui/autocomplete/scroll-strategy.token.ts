import { Overlay, ScrollStrategy } from '@angular/cdk/overlay'
import { InjectionToken, inject } from '@angular/core'

/** Sets scroll strategy for autocomplete suggestion panel. */
export const CK_AUTOCOMPLETE_SCROLL_STRATEGY =
  new InjectionToken<ScrollStrategy>('CK_AUTOCOMPLETE_SCROLL_STRATEGY', {
    providedIn: 'root',
    factory: (): ScrollStrategy => {
      const overlay = inject(Overlay)

      return overlay.scrollStrategies.reposition()
    }
  })
