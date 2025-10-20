import { _IdGenerator } from '@angular/cdk/a11y'
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { Directionality } from '@angular/cdk/bidi'
import { Directive, inject, input, ViewContainerRef } from '@angular/core'

import { CkPopover } from './popover'

type CkPopoverPosition = 'top' | 'bottom' | 'left' | 'right'

@Directive({
  selector: '[ckPopoverTriggerFor]',
  exportAs: 'ckPopoverTrigger',
  standalone: true,
  host: {
    '[id]': 'id',
    '(mouseenter)': '_show($event)',
    '(mouseleave)': '_hide($event)',
  },
})
export class CkPopoverTrigger {
  public readonly class = input<string>()
  public readonly id = inject(_IdGenerator).getId('ck-popup-')
  public readonly popover = input.required<CkPopover>({
    alias: 'ckPopoverTriggerFor',
  })

  public readonly position = input<CkPopoverPosition>('bottom', {
    alias: 'ckPopoverPosition',
  })

  private readonly _overlay = inject(Overlay)
  private readonly _viewContainerRef = inject(ViewContainerRef)
  private readonly _directionality = inject(Directionality, { optional: true })
  private _overlayRef?: OverlayRef
  private _portal?: TemplatePortal

  protected _show(): void {
    this._create()
  }

  protected _hide(): void {
    this._destroyOverlay()
  }

  private _create(): void {
    this._destroyOverlay()

    this._portal = new TemplatePortal(
      this.popover()._template(),
      this._viewContainerRef,
    )

    this._overlayRef = this._overlay.create(this._createConfig())
    this._overlayRef.attach(this._portal)
  }

  private _createConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      direction: this._directionality ?? 'ltr',
    })
  }

  private _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
    return (
      this._overlay
        .position()
        .flexibleConnectedTo(this._viewContainerRef.element)
        .withPositions(this._getOverlayPositions(this.position()))
        .withPush(false)
        // Apply margins to avoid clipping the dropdown by viewport
        .withFlexibleDimensions(true)
        .withGrowAfterOpen(true)
        .withViewportMargin(6)
    )
  }

  private _getOverlayPositions(
    position: CkPopoverPosition,
  ): ConnectedPosition[] {
    const offset = 4

    const top: ConnectedPosition = {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -offset,
    }

    const bottom: ConnectedPosition = {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: offset,
    }

    const left: ConnectedPosition = {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: -offset,
    }

    const right: ConnectedPosition = {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: offset,
    }

    const positions = {
      top: [top, bottom, right, left],
      bottom: [bottom, top, right, left],
      left: [left, right, bottom, top],
      right: [right, left, bottom, top],
      auto: [bottom, top, right, left],
    }

    return positions[position]
  }

  private _destroyOverlay(): void {
    this._overlayRef?.dispose()
    this._overlayRef = undefined
  }
}
