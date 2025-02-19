import { cva, VariantProps } from 'class-variance-authority'

export type Color = VariantProps<typeof checkbox>['color']

export const checkbox = cva(
  [
    'peer',
    'shadow-xs',
    'relative',
    'aspect-square',
    'w-4',
    'shrink-0',
    'appearance-none',
    'rounded-sm',
    'transition-colors',
    'after:absolute',
    'after:inset-0',
    'after:rounded',
    'after:border',
    'after:bg-contain',
    'checked:after:bg-checkbox-checked',
    'indeterminate:after:bg-checkbox-indeterminate',
    'in-[.ck-invalid]:after:border-destructive',
    'in-[.ck-invalid]:checked:bg-destructive',
  ],
  {
    variants: {
      color: {
        primary: [
          'after:border-primary',
          'checked:bg-primary',
          'indeterminate:bg-primary',
          'outline-primary/50',
        ],
      },
    },
    defaultVariants: { color: 'primary' },
  },
)
