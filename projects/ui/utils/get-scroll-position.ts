/**
 * Returns a position in px to which the `container` should be scrolled
 * to make the `element` visible.
 *
 * @param element Element to be scrolled to.
 * @param container Scroll container.
 */
export function getScrollPosition(
  element: HTMLElement,
  container: HTMLElement
): number {
  if (element.offsetTop < container.scrollTop) return element.offsetTop

  if (
    element.offsetTop + element.offsetHeight <=
    container.scrollTop + container.offsetHeight
  ) {
    return container.scrollTop
  }

  return Math.max(
    0,
    element.offsetTop - container.offsetHeight + element.offsetHeight
  )
}
