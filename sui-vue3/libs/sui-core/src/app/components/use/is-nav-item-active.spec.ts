import { useIsNavItemActive } from './is-nav-item-active'

describe('useIsNavItemActive', () => {
  it('should return true if forceActiveState is active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemActive(false, false, 'active')

    // ASSERT
    expect(isActive).toEqual(true)
  })

  it('should return false if forceActiveState is in-active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemActive(false, false, 'in-active')

    // ASSERT
    expect(isActive).toEqual(false)
  })

  it('should return false if forceActiveState is invalid', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemActive(false, false, 'apple')

    // ASSERT
    expect(isActive).toEqual(false)
  })

  it('should return vueRouterActiveState if forceActiveState is not a function or string', () => {
    // ASSERT
    expect(useIsNavItemActive(true, false, undefined)).toEqual(true)
    expect(useIsNavItemActive(false, false, undefined)).toEqual(false)
  })

  it('should return true if forceActiveState function returns active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemActive(false, false, (_a: boolean, _b: boolean) => 'active')

    // ASSERT
    expect(isActive).toEqual(true)
  })

  it('should return false if forceActiveState function returns in-active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemActive(false, false, (_a: boolean, _b: boolean) => 'in-active')

    // ASSERT
    expect(isActive).toEqual(false)
  })
})
