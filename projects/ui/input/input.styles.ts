import { cva } from 'class-variance-authority'

export const inputStyles = cva(
  [
    'w-full',
    'appearance-none',
    'rounded-md',
    'border',
    'border-input',
    'bg-background',
    'px-3',
    'py-2',
    'file:border-0',
    'file:bg-transparent',
    'file:font-medium',
    'placeholder:text-muted-foreground',
    'invalid:border-destructive',
    'invalid:text-destructive',
    'invalid:ring-destructive/50',
    'invalid:placeholder:text-destructive/70',
    '[&:is(select)]:bg-select-chevron-down',
    '[&:is(select)]:!bg-[right_.5rem_center]',
    '[&:is(select)]:bg-no-repeat',
    '[&:is(select)]:dark:bg-select-chevron-down-dark',
    '[&:not(textarea)]:h-10'
  ],
  { variants: { padStart: { true: 'ps-9' }, padEnd: { true: 'pe-9' } } }
)
