import { cva } from 'class-variance-authority'

// The calendar inside brings its own surface styles, so the panel only holds
// the popup animations.
export const datepickerPanelStyles = cva('block', {
  variants: {
    state: {
      open: [
        'animate-in',
        'fade-in',
        'zoom-in-95',
        'in-[.ck-position-below]:slide-in-from-top-2',
        'in-[.ck-position-above]:slide-in-from-bottom-2',
      ],
      closed: [
        'animate-out',
        'fade-out',
        'zoom-out-95',
        'in-[.ck-position-below]:slide-out-to-top-2',
        'in-[.ck-position-above]:slide-out-to-bottom-2',
      ],
    },
  },
  defaultVariants: { state: 'closed' },
})
