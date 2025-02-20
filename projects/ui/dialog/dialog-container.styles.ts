import { cva } from 'class-variance-authority'

export const dialogContainerStyles = cva([
  'block',
  'w-full',
  'overflow-auto',
  'rounded-lg',
  'border',
  'text-sm',
  'bg-surface',
  'text-surface-foreground',
  'shadow-xl',
  '[&:not(:has(_:is(ck-dialog-actions,_[ck-dialog-actions])))_ck-dialog-content]:pb-6',
  '[&:not(:has(_:is(ck-dialog-header,_[ck-dialog-header])))_ck-dialog-content]:pt-6',
])
