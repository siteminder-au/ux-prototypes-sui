import { inject } from 'vue'

export const CM_PAGE_ID_KEY = 'cm-page-id'
export const CM_TAB_ID_KEY = 'cm-tab-id'
export const CM_SECTION_ID_KEY = 'cm-section-id'

// follow BEM format
const BLOCK_DELIMITER = '-'
const ELEMENT_DELIMITER = '__'
export const useHeapIoKey = (basePath: string): { generateHeapIoKey: (element?: string | null) => string } => {
  // heap doesn't seem to like dots in the id
  const transformBasePath = basePath.replace(/\./g, BLOCK_DELIMITER)
  const pageId = inject(CM_PAGE_ID_KEY, null)
  const tabId = inject(CM_TAB_ID_KEY, null)
  const sectionId = inject(CM_SECTION_ID_KEY, null)

  const addBlockDelimiter = (str: string | null): string => (str ? `${str}${BLOCK_DELIMITER}` : '')

  return {
    generateHeapIoKey: (element?: string | null) => {
      // sample: "Distribution-DistributionTabRatePlans-components-base-some-key__searchInputLabel"
      return `${addBlockDelimiter(pageId)}${addBlockDelimiter(tabId)}${addBlockDelimiter(sectionId)}${transformBasePath}${element ? `${ELEMENT_DELIMITER}${element}` : ''}`
    },
  }
}
