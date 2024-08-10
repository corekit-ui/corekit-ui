import { cva, type VariantProps } from 'class-variance-authority'

export type Color = VariantProps<typeof badge>['color']
export type Appearance = VariantProps<typeof badge>['appearance']

export const badge = cva(
  'inline-flex items-center justify-center rounded-full border h-6 text-xs px-2 min-w-6',
  {
    variants: {
      appearance: { solid: 'border-transparent', outline: '' },
      color: {
        primary: '',
        muted: '',
        success: '',
        warning: '',
        destructive: ''
      }
    },
    compoundVariants: [
      {
        appearance: 'solid',
        color: 'primary',
        class: 'bg-primary text-primary-foreground'
      },
      {
        appearance: 'solid',
        color: 'muted',
        class: 'bg-muted text-muted-foreground'
      },
      {
        appearance: 'solid',
        color: 'success',
        class: 'bg-success text-success-foreground'
      },
      {
        appearance: 'solid',
        color: 'warning',
        class: 'bg-warning text-warning-foreground'
      },
      {
        appearance: 'solid',
        color: 'destructive',
        class: 'bg-destructive text-destructive-foreground'
      },
      {
        appearance: 'outline',
        color: 'primary',
        class: 'border-primary text-primary'
      },
      {
        appearance: 'outline',
        color: 'muted',
        class: 'border-border text-muted-foreground'
      },
      {
        appearance: 'outline',
        color: 'success',
        class: 'border-success text-success'
      },
      {
        appearance: 'outline',
        color: 'warning',
        class: 'border-warning text-warning'
      },
      {
        appearance: 'outline',
        color: 'destructive',
        class: 'border-destructive text-destructive'
      }
    ],
    defaultVariants: { appearance: 'solid', color: 'primary' }
  }
)
