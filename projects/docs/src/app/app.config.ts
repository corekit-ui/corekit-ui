import {
  type ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import {
  Check,
  CircleX,
  Info,
  LucideAngularModule,
  Plus,
  Search,
  Send,
  Terminal,
  ToggleLeft,
  TriangleAlert,
} from 'lucide-angular'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Terminal,
        Info,
        TriangleAlert,
        CircleX,
        Check,
        Search,
        ToggleLeft,
        Send,
        Plus,
      }),
    ),
  ],
}
