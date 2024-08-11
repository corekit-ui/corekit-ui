import { cva, VariantProps } from 'class-variance-authority'

export type Size = VariantProps<typeof avatar>['size']

export const avatar = cva(
  'rounded-full bg-muted inline-flex items-center justify-center text-muted-foreground relative overflow-hidden border border-border',
  {
    variants: {
      size: { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10', lg: 'w-12 h-12' }
    },
    defaultVariants: { size: 'md' }
  }
)
