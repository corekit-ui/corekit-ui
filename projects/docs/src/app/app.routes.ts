import type { Routes } from '@angular/router'

import { LayoutComponent } from './layout/layout/layout.component'
import { COMPONENTS_PATHS } from './features/components/components.paths'
import { COMPONENTS_ROUTES } from './features/components/components.routes'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: COMPONENTS_PATHS.root,
      },
      ...COMPONENTS_ROUTES,
    ],
  },
]
