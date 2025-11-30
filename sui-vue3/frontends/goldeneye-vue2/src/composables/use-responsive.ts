import { Ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'

interface MediaQueryMatrix {
  mobileOnly: Ref<boolean>
  tabletOnly: Ref<boolean>
  tabletUp: Ref<boolean>
  desktopUp: Ref<boolean>
}

export const useResponsive = (): MediaQueryMatrix => {
  const mobileBreakpoint = 768
  const tabletBreakpoint = 1024

  const mobileOnly = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`)
  const tabletOnly = useMediaQuery(`(min-width: ${mobileBreakpoint + 1}px) and (max-width: ${tabletBreakpoint}px)`)
  const tabletUp = useMediaQuery(`(min-width: ${mobileBreakpoint + 1}px)`)
  const desktopUp = useMediaQuery(`(min-width: ${tabletBreakpoint + 1}px)`)

  return ({
    mobileOnly,
    tabletOnly,
    tabletUp,
    desktopUp,
  })
}
