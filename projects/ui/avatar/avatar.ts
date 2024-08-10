import { IMAGE_LOADER, NgOptimizedImage } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  signal
} from '@angular/core'
import { classNames } from '@corekit/ui/utils'
import { avatar, Size } from './avatar.styles'
import { AVATAR_IMAGE_LOADER } from './tokens/avatar-image-loader'

@Component({
  selector: '[ckAvatar], ck-avatar',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './avatar.html',
  providers: [{ provide: IMAGE_LOADER, useExisting: AVATAR_IMAGE_LOADER }],
  host: {
    '[class]': '_class',
    '[role]': 'errored() ? "img" : null',
    '[attr.aria-label]': 'errored() ? alt() : null'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CkAvatar {
  public readonly class = input<string>()

  /**
   * Image URL
   */
  public readonly src = input.required<string>()

  /**
   * Alternative text description of the image.
   *
   * @example
   * ```html
   * <ck-avatar src="..." alt="John Appleseed" />
   * ```
   */
  public readonly alt = input.required<string>()

  /**
   * Avatar size
   *
   */
  public readonly size = input<Size>()

  /**
   * Indicates whether this image should have a high priority
   * for loading.
   *
   * @see https://angular.dev/api/common/NgOptimizedImage#priority
   */
  public readonly priority = input<boolean, unknown>(false, {
    transform: booleanAttribute
  })

  /**
   * Text to be shown while image is loading or errored.
   * Person's initials usually.
   *
   * @example
   * ```html
   * <ck-avatar src="..." alt="John Appleseed" fallback="JA" />
   * ```
   */
  public readonly fallback = input<string>()

  protected readonly loaded = signal(false)
  protected readonly errored = signal(false)

  protected get _class(): string {
    return classNames(avatar({ size: this.size() }), this.class())
  }
}
