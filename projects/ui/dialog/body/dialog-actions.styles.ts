import { cva, VariantProps } from 'class-variance-authority'

export type CkDialogActionAlignment = VariantProps<
  typeof dialogActionsStyles
>['align']

export const dialogActionsStyles = cva(
  'flex flex-col sm:flex-row items-center gap-3 px-6 pb-6 pt-4 bg-surface/95 backdrop-blur-lg supports-[backdrop-filter]:bg-surface/60',
  {
    variants: {
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        stretch: '[&_>_*]:w-full',
      },
      sticky: { true: 'sticky bottom-0' },
    },
    defaultVariants: { align: 'end', sticky: true },
  },
)
