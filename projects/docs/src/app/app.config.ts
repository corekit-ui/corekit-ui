import {
  type ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import {
  Check,
  CircleX,
  Info,
  LucideAngularModule,
  Search,
  Terminal,
  TriangleAlert
} from 'lucide-angular'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Terminal,
        Info,
        TriangleAlert,
        CircleX,
        Check,
        Search
      })
    )
  ]
}
