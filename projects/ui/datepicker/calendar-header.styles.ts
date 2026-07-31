import { classNames } from '@corekit/ui/utils'

export const calendarHeaderStyles = classNames(
  'flex',
  'h-(--ck-cell-size)',
  'items-center',
  'justify-between',
  'gap-1',
)

export const calendarHeaderButtonStyles = classNames(
  'inline-flex',
  'size-(--ck-cell-size)',
  'shrink-0',
  'items-center',
  'justify-center',
  'rounded-md',
  'transition-colors',
  'select-none',
  'hover:bg-muted',
  'hover:text-foreground',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-0',
  'outline-foreground/30',
  'disabled:pointer-events-none',
  'disabled:opacity-50',
  '[&_svg]:size-4',
  '[&_svg]:shrink-0',
)

export const calendarHeaderLabelStyles = classNames(
  'flex',
  'h-(--ck-cell-size)',
  'items-center',
  'rounded-md',
  'px-2',
  'text-sm',
  'font-medium',
  'transition-colors',
  'select-none',
  'hover:bg-muted',
  'hover:text-foreground',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-0',
  'outline-foreground/30',
)
