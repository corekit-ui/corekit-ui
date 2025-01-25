import { cva } from 'class-variance-authority'

export const dialogHeaderStyles = cva(
  [
    'flex',
    'gap-2',
    'justify-between',
    'px-6',
    'pb-4',
    'pt-6',
    'bg-surface/95',
    'backdrop-blur',
    'supports-[backdrop-filter]:bg-surface/60',
  ],
  {
    variants: { sticky: { true: 'sticky top-0' } },
    defaultVariants: { sticky: true },
  },
)
