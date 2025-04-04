import {
  createFakeEvent,
  createKeyboardEvent,
  createMouseEvent,
} from './events'
import { ModifierKeys } from './types'

/**
 * Utility to dispatch any event on a Node.
 * @docs-private
 */
export function dispatchEvent<T extends Event>(
  node: Node | Window,
  event: T,
): T {
  node.dispatchEvent(event)

  return event
}

/**
 * Shorthand to dispatch a keyboard event with a specified key code and
 * optional modifiers.
 * @docs-private
 */
export function dispatchKeyboardEvent(
  node: Node,
  type: string,
  keyCode?: number,
  key?: string,
  modifiers?: ModifierKeys,
  code?: string,
): KeyboardEvent {
  return dispatchEvent(
    node,
    createKeyboardEvent(type, keyCode, key, modifiers, code),
  )
}

/**
 * Shorthand to dispatch a fake event on a specified node.
 * @docs-private
 */
export function dispatchFakeEvent(
  node: Node | Window,
  type: string,
  bubbles?: boolean,
): Event {
  return dispatchEvent(node, createFakeEvent(type, bubbles))
}

/**
 * Shorthand to dispatch a mouse event on the specified coordinates.
 * @docs-private
 */
export function dispatchMouseEvent(node: Node, type: string): MouseEvent {
  return dispatchEvent(node, createMouseEvent(type))
}
