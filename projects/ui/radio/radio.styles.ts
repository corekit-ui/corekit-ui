import { cva, VariantProps } from 'class-variance-authority'

export type Color = VariantProps<typeof radio>['color']

export const radio = cva(
  [
    'peer',
    'relative',
    'flex',
    'aspect-square',
    'w-4',
    'appearance-none',
    'items-center',
    'justify-center',
    'rounded-full',
    'border',
    'after:absolute',
    'after:aspect-square',
    'after:w-2',
    'after:scale-0',
    'after:rounded-full',
    'after:transition-transform',
    'checked:after:scale-100',
    'invalid:border-destructive',
    'invalid:ring-destructive/50',
    'invalid:checked:after:bg-destructive'
  ],
  {
    variants: {
      color: {
        primary: 'border-primary checked:after:bg-primary ring-primary/50',
        accent: 'border-accent checked:after:bg-accent ring-accent/50'
      }
    },
    defaultVariants: { color: 'primary' }
  }
)
