import { useIsNavItemExactActive } from './is-nav-item-exact-active'

describe('useIsNavItemExactActive', () => {
  it('should return true if forceActiveState is exact-active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemExactActive(false, false, 'exact-active')

    // ASSERT
    expect(isActive).toEqual(true)
  })

  it('should return false if forceActiveState is not exact-active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemExactActive(false, false, 'in-active')

    // ASSERT
    expect(isActive).toEqual(false)
  })

  it('should return false if forceActiveState is invalid', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemExactActive(false, false, 'apple')

    // ASSERT
    expect(isActive).toEqual(false)
  })

  it('should return vueRouterExactActiveState if forceActiveState is not a function or string', () => {
    // ASSERT
    expect(useIsNavItemExactActive(false, true, undefined)).toEqual(true)
    expect(useIsNavItemExactActive(true, false, undefined)).toEqual(false)
  })

  it('should return true if forceActiveState function returns exact-active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemExactActive(false, false, (_a: boolean, _b: boolean) => 'exact-active')

    // ASSERT
    expect(isActive).toEqual(true)
  })

  it('should return false if forceActiveState function returns in-active', () => {
    // ARRANGE/ACT
    const isActive = useIsNavItemExactActive(false, false, (_a: boolean, _b: boolean) => 'in-active')

    // ASSERT
    expect(isActive).toEqual(false)
  })
})
