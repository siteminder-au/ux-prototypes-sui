import { computed, ref } from 'vue'
import { illustrations, lhIllustrations } from '../illustrations/illustrations'

import { toastService } from '../../services/toast'

interface IllustrationCategory {
  categoryName: string
  illustrations: { source: string, label: string }[]
}

export default {
  title: 'Foundations/Illustrations',
}

export const SiteMinder = () => ({
  setup: () => {
    const debouncedQuery = ref('')
    const searchQuery = ref('')

    const CATEGORY_ORDER = ['medium', 'large', 'small']

    let inputTimer: NodeJS.Timeout | undefined

    const illustrationMap = computed(() => {
      const normalizedQuery = debouncedQuery.value.toLowerCase()

      return illustrations
        .filter((illustration) => {
          const fileNameParts = illustration.source.split('/')
          const fileName = fileNameParts[fileNameParts.length - 1].split('.')[0]

          return (
            illustration.label.toLowerCase().includes(normalizedQuery)
            || fileName.includes(normalizedQuery)
          )
        })
        .sort((a, b) => {
          return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
        })
        .reduce((acc: Record<string, IllustrationCategory | undefined>, illustration) => {
          const category = illustration.category.toLowerCase()
          const item = {
            source: illustration.source,
            label: illustration.label,
          }

          if (acc[category]) {
            acc[category]?.illustrations.push(item)
          } else {
            acc[category] = {
              categoryName: category[0].toUpperCase() + category.substring(1),
              illustrations: [item],
            }
          }

          return acc
        }, {})
    })

    const hasResults = computed(() => {
      return Object.keys(illustrationMap.value).length > 0
    })

    const clearSearch = () => {
      searchQuery.value = ''
      debouncedQuery.value = ''
    }

    const copyLink = async (e: Event, source: string) => {
      e.preventDefault()

      try {
        await navigator.clipboard.writeText(source)

        toastService({
          type: 'success',
          message: 'Link copied to clipboard',
          miniInfo: true,
        })
      } catch (err) {
        toastService({
          type: 'warning',
          message: 'Something went wrong please try again later',
          miniInfo: true,
        })
      }
    }

    const search = () => {
      clearTimeout(inputTimer)

      inputTimer = setTimeout(() => {
        debouncedQuery.value = searchQuery.value
      }, 250)
    }

    return {
      hasResults,
      illustrationMap,
      searchQuery,
      clearSearch,
      copyLink,
      search,
    }
  },
  template: `
    <div role="main" class="p-0 tablet:p-32">
      <div style="max-width: 780px">
        <h1 class="sm-h1">Siteminder</h1>
        <div class="flex gap-24 mb-48">
          <div style="flex: 1; max-width: 284px">
            <sm-input name="search" v-model="searchQuery" label="Name" placeholder="Search illustration" suffix-icon="action-search" @input="search" />
          </div>
          <sm-button type="text" @click="clearSearch" class="relative" style="bottom: -1px">Clear</sm-button>
        </div>
      </div>

      <div style="max-width: 1382px">
        <div class="mb-80" v-for="group in illustrationMap" :key="group.categoryName">
          <h2 class="sm-h4">{{ group.categoryName }} illustrations</h2>

          <div class="flex flex-wrap gap-32">
            <div
              v-for="(illustration, index) in group.illustrations"
              :key="illustration.source"
              class="flex flex-col"
            >
              <figure
                class="flex-1 p-8 m-0 mb-8 flex items-center justify-center"
                style="border: 1px solid #C6CEDA; min-width: 90px; min-height: 90px"
              >
                <img style="max-width: 100%" :src="illustration.source" :aria-labelledby="group.categoryName + '-' + index" />
              </figure>

              <h3 class="sm-h6 mb-8" :id="group.categoryName + '-' + index">{{ illustration.label }}</h3>

              <a class="cursor-pointer" @click="copyLink($event, illustration.source)">Copy link <sm-icon name="action-copy" /></a>
            </div>
          </div>
        </div>

        <p v-if="!hasResults">No results found</p>
      </div>
    </div>
  `,
})

SiteMinder.storyName = 'Siteminder'

export const LittleHotelier = () => ({
  setup: () => {
    const debouncedQuery = ref('')
    const searchQuery = ref('')

    const CATEGORY_ORDER = ['medium', 'large', 'small']

    let inputTimer: NodeJS.Timeout | undefined

    const illustrationMap = computed(() => {
      const normalizedQuery = debouncedQuery.value.toLowerCase()

      return lhIllustrations
        .filter((illustration) => {
          const fileNameParts = illustration.source.split('/')
          const fileName = fileNameParts[fileNameParts.length - 1].split('.')[0]

          return (
            illustration.label.toLowerCase().includes(normalizedQuery)
            || fileName.includes(normalizedQuery)
          )
        })
        .sort((a, b) => {
          return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
        })
        .reduce((acc: Record<string, IllustrationCategory | undefined>, illustration) => {
          const category = illustration.category.toLowerCase()
          const item = {
            source: illustration.source,
            label: illustration.label,
          }

          if (acc[category]) {
            acc[category]?.illustrations.push(item)
          } else {
            acc[category] = {
              categoryName: category[0].toUpperCase() + category.substring(1),
              illustrations: [item],
            }
          }

          return acc
        }, {})
    })

    const hasResults = computed(() => {
      return Object.keys(illustrationMap.value).length > 0
    })

    const clearSearch = () => {
      searchQuery.value = ''
      debouncedQuery.value = ''
    }

    const copyLink = async (e: Event, source: string) => {
      e.preventDefault()

      try {
        await navigator.clipboard.writeText(source)

        toastService({
          type: 'success',
          message: 'Link copied to clipboard',
          miniInfo: true,
        })
      } catch (err) {
        toastService({
          type: 'warning',
          message: 'Something went wrong please try again later',
          miniInfo: true,
        })
      }
    }

    const search = () => {
      clearTimeout(inputTimer)

      inputTimer = setTimeout(() => {
        debouncedQuery.value = searchQuery.value
      }, 250)
    }

    return {
      hasResults,
      illustrationMap,
      searchQuery,
      clearSearch,
      copyLink,
      search,
    }
  },
  template: `
    <div role="main" class="p-0 tablet:p-32">
      <div style="max-width: 780px">
        <h1 class="sm-h1">Little Hotelier</h1>
        <div class="flex gap-24 mb-48">
          <div style="flex: 1; max-width: 284px">
            <sm-input name="search" v-model="searchQuery" label="Name" placeholder="Search illustration" suffix-icon="action-search" @input="search" />
          </div>
          <sm-button type="text" @click="clearSearch" class="relative" style="bottom: -1px">Clear</sm-button>
        </div>
      </div>

      <div style="max-width: 1382px">
        <div class="mb-80" v-for="group in illustrationMap" :key="group.categoryName">
          <h2 class="sm-h4">{{ group.categoryName }} illustrations</h2>

          <div class="flex flex-wrap gap-32">
            <div
              v-for="(illustration, index) in group.illustrations"
              :key="illustration.source"
              class="flex flex-col"
            >
              <figure
                class="flex-1 p-8 m-0 mb-8 flex items-center justify-center"
                style="border: 1px solid #C6CEDA; min-width: 90px; min-height: 90px"
              >
                <img style="max-width: 100%" :src="illustration.source" :aria-labelledby="group.categoryName + '-' + index" />
              </figure>

              <h3 class="sm-h6 mb-8" :id="group.categoryName + '-' + index">{{ illustration.label }}</h3>

              <a class="cursor-pointer" @click="copyLink($event, illustration.source)">Copy link <sm-icon name="action-copy" /></a>
            </div>
          </div>
        </div>

        <p v-if="!hasResults">No results found</p>
      </div>
    </div>
  `,
})

LittleHotelier.storyName = 'Little Hotelier'
