import { cva } from 'class-variance-authority'

export const headerContainerStyles =
  'bg-muted flex w-fit items-center justify-center rounded-lg p-1'

export const labelWrapperStyles = cva(['font-medium px-2 py-1 rounded-lg'], {
  variants: {
    state: {
      default: '',
      active: 'bg-background shadow-sm',
    },
  },
})
