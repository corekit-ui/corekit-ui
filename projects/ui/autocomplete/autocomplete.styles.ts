import { cva } from 'class-variance-authority'

export const autocompletePanelStyles = cva(
  [
    'flex',
    'h-full',
    'w-full',
    'flex-col',
    'overflow-auto',
    'rounded-lg',
    'border',
    'bg-surface',
    'p-1',
    'text-surface-foreground',
    'shadow-md',
    'motion-safe:scroll-smooth',
  ],
  {
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
  },
)
