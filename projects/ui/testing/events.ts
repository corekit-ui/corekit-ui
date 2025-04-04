import { ModifierKeys } from './types'

/**
 * Creates a fake event object with any desired event type.
 * @docs-private
 */
export function createFakeEvent(
  type: string,
  bubbles = false,
  cancelable = true,
  composed = true,
): Event {
  return new Event(type, { bubbles, cancelable, composed })
}

/**
 * Creates a keyboard event with the specified key and modifiers.
 * @docs-private
 */
export function createKeyboardEvent(
  type: string,
  keyCode = 0,
  key = '',
  modifiers: ModifierKeys = {},
  code = '',
): KeyboardEvent {
  return new KeyboardEvent(type, {
    bubbles: true,
    cancelable: true,
    // Required for shadow DOM events.
    composed: true,
    view: window,
    keyCode,
    key,
    shiftKey: modifiers.shift,
    metaKey: modifiers.meta,
    altKey: modifiers.alt,
    ctrlKey: modifiers.control,
    code,
  })
}

/**
 * Creates a browser MouseEvent with the specified options.
 * @docs-private
 */
export function createMouseEvent(type: string): MouseEvent {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    // Required for shadow DOM events.
    composed: true,
    view: window,
    detail: 1,
    relatedTarget: null,
    buttons: 1,
  })

  return event
}
