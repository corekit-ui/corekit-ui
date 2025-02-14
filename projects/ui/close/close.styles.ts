import { cva, VariantProps } from 'class-variance-authority'

export type CkCloseAppearance = VariantProps<typeof closeStyles>['appearance']

export const closeStyles = cva(null, {
  variants: {
    appearance: {
      native: null,
      icon: 'inline-flex aspect-square h-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:opacity-80 motion-safe:transition-opacity',
    },
  },
})
