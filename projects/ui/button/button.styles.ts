import { cva, type VariantProps } from 'class-variance-authority'

export type Size = VariantProps<typeof button>['size']
export type Shape = VariantProps<typeof button>['shape']
export type Color = VariantProps<typeof button>['color']
export type Appearance = VariantProps<typeof button>['appearance']

export const button = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md border font-medium transition-colors',
  {
    variants: {
      size: { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4', lg: 'h-11 px-8' },
      shape: { rectangle: null, square: null, pill: null, circle: null },
      color: {
        primary: 'bg-primary border-primary focus-visible:ring-primary/50',
        secondary: 'bg-secondary border-secondary focus-visible:ring-secondary',
        success: 'bg-success border-success focus-visible:ring-success/50',
        warning: 'bg-warning border-warning focus-visible:ring-warning/50',
        destructive:
          'bg-destructive border-destructive focus-visible:ring-destructive/50'
      },
      appearance: {
        solid: 'hover:bg-opacity-90',
        outline: 'bg-opacity-0',
        ghost: 'bg-opacity-0 border-transparent'
      }
    },
    compoundVariants: [
      { shape: ['square', 'circle'], class: 'p-0 aspect-square' },
      { shape: ['pill', 'circle'], class: 'rounded-full' },

      {
        appearance: ['solid', 'outline'],
        class: 'shadow-sm active:shadow-none'
      },

      {
        appearance: ['outline', 'ghost'],
        class: 'hover:bg-opacity-5 dark:hover:bg-opacity-10'
      },

      {
        color: 'primary',
        appearance: 'solid',
        class: 'text-primary-foreground'
      },
      {
        color: 'secondary',
        class:
          'text-secondary-foreground hover:bg-opacity-90 dark:hover:bg-opacity-90'
      },
      {
        color: 'success',
        appearance: 'solid',
        class: 'text-success-foreground'
      },
      {
        color: 'warning',
        appearance: 'solid',
        class: 'text-warning-foreground'
      },
      {
        color: 'destructive',
        appearance: 'solid',
        class: 'text-destructive-foreground'
      },

      {
        appearance: ['outline', 'ghost'],
        color: 'primary',
        class: 'text-primary'
      },
      {
        appearance: ['outline', 'ghost'],
        color: 'success',
        class: 'text-success'
      },
      {
        appearance: ['outline', 'ghost'],
        color: 'warning',
        class: 'text-warning'
      },
      {
        appearance: ['outline', 'ghost'],
        color: 'destructive',
        class: 'text-destructive'
      }
    ],
    defaultVariants: {
      size: 'md',
      shape: 'rectangle',
      color: 'primary',
      appearance: 'solid'
    }
  }
)
