import { cva } from 'class-variance-authority'

/** Styles of the select trigger (the host element). */
export const selectTriggerStyles = cva([
  'flex',
  'w-full',
  'h-10',
  'pointer-coarse:max-lg:h-11',
  'items-center',
  'justify-between',
  'gap-2',
  'cursor-default',
  'select-none',
  'appearance-none',
  'shadow-xs',
  'rounded-md',
  'border',
  'bg-background',
  'px-3',
  'py-2',
  'pointer-coarse:max-lg:px-3.5',
  'text-sm',
  'pointer-coarse:max-lg:text-base',
  'whitespace-nowrap',
  'focus-visible:shadow-none',
  'focus-visible:outline-offset-0',
  'focus-visible:outline-1',
  'not-in-[.ck-invalid]:focus-visible:outline-primary',
  'in-[.ck-invalid]:border-destructive',
  'in-[.ck-invalid]:text-destructive',
  'aria-disabled:bg-muted',
  'aria-disabled:shadow-none',
  'aria-disabled:text-muted-foreground',
])

/** Styles of the select dropdown panel. */
export const selectPanelStyles = cva(
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
