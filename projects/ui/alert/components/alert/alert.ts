import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { cva, type VariantProps } from 'class-variance-authority'

type Variant = VariantProps<typeof alert>['variant']

const alert = cva('rounded-lg border p-4 flex gap-3', {
  variants: {
    variant: {
      success: 'border-success/50 text-success',
      warning: 'border-warning/50 text-warning',
      destructive: 'border-destructive/50 text-destructive'
    }
  }
})

@Component({
  selector: '[ckAlert], ck-alert',
  standalone: true,
  templateUrl: './alert.html',
  host: { '[class]': '_class', role: 'alert' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CkAlert {
  public readonly color = input<Variant>()
  public readonly class = input<string>()

  protected get _class(): string {
    return classNames(alert({ variant: this.color() }), this.class())
  }
}
