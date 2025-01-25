import { cva } from 'class-variance-authority'

export const dialogCloseStyles = cva(null, {
  variants: {
    displayAsIcon: {
      true: 'inline-flex aspect-square h-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:opacity-80 focus-visible:ring-muted motion-safe:transition-opacity',
    },
  },
})
