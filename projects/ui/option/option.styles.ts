import { cva } from 'class-variance-authority'

export const optionStyles = cva(
  [
    'relative',
    'flex',
    'gap-2',
    'cursor-default',
    'select-none',
    'items-center',
    'rounded-sm',
    'px-2',
    'py-1.5',
    'text-sm',
    'outline-none',
    'motion-safe:transition-colors'
  ],
  {
    variants: {
      intent: {
        default: 'hover:bg-secondary',
        destructive: [
          'text-destructive',
          'ring-destructive',
          'hover:bg-destructive/5',
          'dark:hover:bg-destructive/10',
          '[&_>_ck-icon]:text-destructive'
        ]
      },
      state: { default: '', active: '' }
    },
    compoundVariants: [
      { intent: 'default', state: 'active', class: 'bg-secondary' },
      {
        intent: 'destructive',
        state: 'active',
        class: 'bg-destructive/5 dark:bg-destructive/10'
      }
    ]
  }
)
