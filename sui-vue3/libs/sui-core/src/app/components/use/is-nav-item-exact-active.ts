export const useIsNavItemExactActive = (
  vueRouterActiveState: boolean,
  vueRouterExactActiveState: boolean,
  forceActiveState?: string | ((activeState: boolean, exactActiveState: boolean) => string),
): boolean => {
  if (typeof forceActiveState === 'function') {
    const computedActiveState = forceActiveState(vueRouterActiveState, vueRouterExactActiveState)

    if (computedActiveState === 'exact-active') {
      return true
    }

    if (computedActiveState === 'in-active') {
      return false
    }
  } else if (typeof forceActiveState === 'string') {

    if (forceActiveState === 'exact-active') {
      return true
    }

    if (forceActiveState === 'in-active') {
      return false
    }
  }

  return vueRouterExactActiveState
}
