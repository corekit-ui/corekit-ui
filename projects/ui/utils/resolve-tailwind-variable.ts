/**
 * Resolves provided CSS custom property to its' value.
 *
 * @param variable CSS custom property name.
 * @returns The value of the passed CSS custom property if found.
 */
export function resolveCssCustomProperty(variable: string): string | undefined {
  if (typeof window === 'undefined') return

  const styles = getComputedStyle(document.documentElement)

  return styles.getPropertyValue(variable)
}
