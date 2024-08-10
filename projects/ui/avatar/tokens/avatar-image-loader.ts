import { ImageLoaderConfig } from '@angular/common'
import { InjectionToken } from '@angular/core'

/**
 * An image loader factory for `NgOptimizedImage` used under the hood.
 *
 * @see https://angular.dev/guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage
 */
export const AVATAR_IMAGE_LOADER = new InjectionToken('AVATAR_IMAGE_LOADER', {
  factory: () => {
    return (config: ImageLoaderConfig): string => config.src
  }
})
