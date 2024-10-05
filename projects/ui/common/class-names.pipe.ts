import { Pipe, PipeTransform } from '@angular/core'
import { classNames } from '@corekit/ui/utils'

@Pipe({ name: 'ckClassNames', standalone: true })
export class CkClassNamesPipe implements PipeTransform {
  public transform(...classes: string[]): string {
    return classNames(...classes)
  }
}
