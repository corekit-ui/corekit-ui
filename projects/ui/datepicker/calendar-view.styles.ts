import { cva } from 'class-variance-authority'
import { classNames } from '@corekit/ui/utils'

export const calendarViewTableStyles = classNames(
  'w-(--ck-calendar-width)',
  'border-collapse',
)

export const calendarViewRowStyles = classNames('flex', 'gap-1')

export const calendarViewCellContainerStyles = classNames(
  'mt-1',
  'flex-1',
  'p-0',
)

/** Cell button stretched to its container, e.g. a month or a year. */
export const calendarViewFullWidthCellStyles = classNames(
  'h-(--ck-cell-size)',
  'w-full',
)

/**
 * Styles of a selectable grid cell button shared by the calendar views.
 * Sizing is up to each view.
 */
export const calendarViewCellStyles = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'text-sm',
    'font-normal',
    'transition-colors',
    'select-none',
    'hover:bg-muted',
    'hover:text-foreground',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-0',
    'outline-foreground/30',
  ],
  {
    variants: {
      state: {
        default: null,
        today: 'bg-muted',
        selected: [
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary',
          'hover:text-primary-foreground',
        ],
      },
      disabled: {
        true: ['pointer-events-none', 'opacity-50'],
        false: null,
      },
    },
    defaultVariants: { state: 'default', disabled: false },
  },
)
