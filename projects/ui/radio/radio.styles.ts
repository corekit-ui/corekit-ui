import { cva, VariantProps } from 'class-variance-authority'

export type Color = VariantProps<typeof radio>['color']

export const radio = cva(
  [
    'peer',
    'shadow-xs',
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
    'in-[.ck-invalid]:border-destructive',
    'in-[.ck-invalid]:checked:after:bg-destructive',
  ],
  {
    variants: {
      color: {
        primary: 'border-primary checked:after:bg-primary outline-primary/50',
      },
    },
    defaultVariants: { color: 'primary' },
  },
)
