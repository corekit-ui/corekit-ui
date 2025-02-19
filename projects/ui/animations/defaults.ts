import { resolveCssCustomProperty } from '@corekit/ui/utils'
import theme from 'tailwindcss/defaultTheme'

export const CK_DEFAULT_TRANSITION_DURATION =
  resolveCssCustomProperty('--default-transition-duration') ??
  theme.transitionDuration.DEFAULT

export const CK_DEFAULT_TRANSITION_TIMING_FUNCTION =
  resolveCssCustomProperty('--default-transition-timing-function') ??
  theme.transitionTimingFunction.DEFAULT
