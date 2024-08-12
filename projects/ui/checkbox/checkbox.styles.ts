import { cva, VariantProps } from 'class-variance-authority'

export type Color = VariantProps<typeof checkbox>['color']

export const checkbox = cva(
  [
    'peer',
    'relative',
    'aspect-square',
    'w-4',
    'shrink-0',
    'appearance-none',
    'rounded-sm',
    'transition-all',
    'after:absolute',
    'after:inset-0',
    'after:rounded',
    'after:border',
    'after:bg-contain',
    'checked:after:bg-checkbox-checked',
    'indeterminate:after:bg-checkbox-indeterminate',
    'invalid:after:border-destructive',
    'invalid:checked:bg-destructive',
    'invalid:ring-destructive/50',
    'dark:checked:after:bg-checkbox-checked-dark',
    'dark:indeterminate:after:bg-checkbox-indeterminate-dark'
  ],
  {
    variants: {
      color: {
        primary: [
          'after:border-primary',
          'checked:bg-primary',
          'indeterminate:bg-primary',
          'ring-primary/50'
        ],
        accent: [
          'after:border-accent',
          'checked:bg-accent',
          'indeterminate:bg-accent',
          'ring-accent/50'
        ]
      }
    },
    defaultVariants: { color: 'primary' }
  }
)
