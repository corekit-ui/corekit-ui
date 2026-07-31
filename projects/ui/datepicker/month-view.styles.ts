import { classNames } from '@corekit/ui/utils'

export const monthViewStyles = classNames('block')

export const monthViewTableStyles = classNames('border-collapse')

export const monthViewWeekRowStyles = classNames('flex', 'gap-1')

export const monthViewWeekdayStyles = classNames(
  'w-(--ck-cell-size)',
  'text-center',
  'text-[0.8rem]',
  'font-normal',
  'text-muted-foreground',
  'select-none',
)

export const monthViewCellStyles = classNames(
  'mt-1',
  'w-(--ck-cell-size)',
  'p-0',
  'text-center',
)

export const monthViewDayStyles = classNames('size-(--ck-cell-size)')
