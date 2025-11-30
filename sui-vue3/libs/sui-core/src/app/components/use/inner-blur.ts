export const useInnerBlur = (element: Element, onInnerBlur: Function) => {

  const onClickHandler = (e: Event) => {

    if (e.target && !isDescendentOf(e.target, element)) {
      remove()
      onInnerBlur()
    }

  }

  const bind = () => {
    document.addEventListener('click', onClickHandler)
  }

  const remove = () => {
    document.removeEventListener('click', onClickHandler)
  }

  return {
    bind,
    remove,
  }

}

export const isDescendentOf = (descendent: EventTarget, ancestor: Element): boolean => {

  let parent: EventTarget | HTMLElement | null = descendent

  while (parent) {
    parent = (parent as Element).parentElement

    if (parent === ancestor) {
      return true
    }
  }

  return false

}
