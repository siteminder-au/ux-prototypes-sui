export const useIsNavItemActive = (
  vueRouterActiveState: boolean,
  vueRouterExactActiveState: boolean,
  forceActiveState?: string | ((activeState: boolean, exactActiveState: boolean) => string),
): boolean => {
  if (typeof forceActiveState === 'function') {
    const computedActiveState = forceActiveState(vueRouterActiveState, vueRouterExactActiveState)

    if (computedActiveState === 'active') {
      return true
    }

    if (computedActiveState === 'in-active') {
      return false
    }
  } else if (typeof forceActiveState === 'string') {
    if (forceActiveState === 'active') {
      return true
    }

    if (forceActiveState === 'in-active') {
      return false
    }
  }

  return vueRouterActiveState
}
