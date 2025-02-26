import { cva } from 'class-variance-authority'

export const dialogHeaderStyles = cva(
  'flex gap-2 justify-between px-6 pb-4 pt-6',
  {
    variants: { sticky: { true: 'sticky top-0' } },
    defaultVariants: { sticky: true },
  },
)
