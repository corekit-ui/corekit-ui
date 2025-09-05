import { cva } from 'class-variance-authority'

export const tabBodyStyles = cva(['basis-full'], {
  variants: {
    state: {
      default: 'absolute inset-0 overflow-hidden',
      active: 'relative overflow-x-hidden overflow-y-auto grow z-[1]',
    },
  },
})
