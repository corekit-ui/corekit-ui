import { cva, type VariantProps } from 'class-variance-authority'

export type Size = VariantProps<typeof button>['size']
export type Shape = VariantProps<typeof button>['shape']
export type Color = VariantProps<typeof button>['color']
export type Appearance = VariantProps<typeof button>['appearance']

export const button = cva(
  'text-sm inline-flex items-center justify-center gap-1 rounded-md border border-transparent whitespace-nowrap motion-safe:transition-colors',
  {
    variants: {
      size: { sm: 'h-8 px-3', md: 'h-10 px-4', lg: 'h-11 px-6' },
      shape: { rectangle: null, square: null, pill: null, circle: null },
      appearance: {
        solid: null,
        outline: null,
        ghost: 'focus-visible:outline-offset-0',
      },
      color: {
        primary: 'outline-primary/50',
        secondary: 'outline-foreground/30',
        success: 'outline-success/50',
        warning: 'outline-warning/50',
        destructive: 'outline-destructive/50',
      },
    },
    compoundVariants: [
      { shape: ['square', 'circle'], class: 'p-0 aspect-square' },
      { shape: ['pill', 'circle'], class: 'rounded-full' },
      { appearance: 'solid', class: 'shadow-xs active:shadow-none' },

      {
        color: 'primary',
        appearance: 'solid',
        class:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary dark:active:bg-primary/80',
      },
      { color: 'primary', appearance: 'outline', class: 'border-primary' },
      {
        color: 'primary',
        appearance: ['outline', 'ghost'],
        class:
          'bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10 dark:hover:bg-primary/10 dark:active:bg-primary/5',
      },

      {
        color: 'secondary',
        appearance: 'solid',
        class:
          'border-secondary-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary-foreground/2 active:bg-secondary dark:border-transparent dark:hover:bg-secondary/80 dark:active:bg-secondary/70',
      },

      {
        color: 'success',
        appearance: 'solid',
        class:
          'bg-success text-success-foreground hover:bg-success/90 active:bg-success dark:active:bg-success/80',
      },
      { color: 'success', appearance: 'outline', class: 'border-success' },
      {
        color: 'success',
        appearance: ['outline', 'ghost'],
        class:
          'bg-transparent text-success hover:bg-success/5 active:bg-success/10 dark:hover:bg-success/10 dark:active:bg-success/5',
      },

      {
        color: 'warning',
        appearance: 'solid',
        class:
          'bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning dark:active:bg-warning/80',
      },
      { color: 'warning', appearance: 'outline', class: 'border-warning' },
      {
        color: 'warning',
        appearance: ['outline', 'ghost'],
        class:
          'bg-transparent text-warning hover:bg-warning/5 active:bg-warning/10 dark:hover:bg-warning/10 dark:active:bg-warning/5',
      },

      {
        color: 'destructive',
        appearance: 'solid',
        class:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive dark:active:bg-destructive/80',
      },
      {
        color: 'destructive',
        appearance: 'outline',
        class: 'border-destructive',
      },
      {
        color: 'destructive',
        appearance: ['outline', 'ghost'],
        class:
          'bg-transparent text-destructive hover:bg-destructive/5 active:bg-destructive/10 dark:hover:bg-destructive/10 dark:active:bg-destructive/5',
      },
    ],
    defaultVariants: {
      size: 'md',
      shape: 'rectangle',
      color: 'primary',
      appearance: 'solid',
    },
  },
)
