import { useClickedState } from './clicked-state'

describe('useClickedState', () => {

  it('should toggle isClicked value', () => {
    const instance = useClickedState()

    expect(instance.isClicked.value).toBe(false)

    instance.onMousedown()

    expect(instance.isClicked.value).toBe(true)

    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(instance.isClicked.value).toBe(false)
  })

})
