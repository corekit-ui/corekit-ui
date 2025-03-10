import { cva } from 'class-variance-authority'

export const accordionItemStyles =
  'block border-b [&[aria-expanded="true"]]:pb-3 transition-[padding-bottom]'

export const accordionItemContentStyles = cva(
  'grid transition-[grid-template-rows]',
  {
    variants: {
      state: {
        expanded: 'animate-in fade-in slide-in-from-top-2 grid-rows-[1fr]',
        collapsed: 'animate-out fade-out slide-out-to-top-2 grid-rows-[0fr]',
      },
    },
  },
)
