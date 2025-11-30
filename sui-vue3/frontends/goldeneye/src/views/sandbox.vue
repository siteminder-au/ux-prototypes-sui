<script setup lang="ts">
import { ref } from 'vue'
import { SmButtonType } from '@siteminder/sui-core/components/sm-button'
import { SmHintCard } from '@siteminder/sui-core/components/sm-hint-card'
import {
  SmMultiSelect,
  SmMultiSelectGroupOption,
  SmMultiSelectOption,
} from '@siteminder/sui-core/components/forms/sm-multi-select'
import { useTranslate } from '@/composables/use-translate'

const { t, n } = useTranslate('views.sandbox')

// #region sm-banner
const isVisible = ref(true)
const isVisible1 = ref(true)
const isVisible2 = ref(true)
const isVisible3 = ref(true)

const handleBeforeClose = (closeCallback: () => void, payload?: string): void => {
  console.info('before close: ', payload)
  // do something ...
  closeCallback()
}
// #endregion

// #region sm-expandable-card
const isExpandable = ref(true)
const isLevelOneExpanded = ref(false)
const isLevelTwoExpanded = ref(false)

const openExpandableCard = (payload?: string): void => {
  console.info('open expandable card: ', payload)
}

const closeExpandableCard = (payload?: string): void => {
  console.info('close expandable card: ', payload)
}
// #endregion

// #region sm-input
const inputName = ref()
const inputEmail = ref()
const inputEmail2 = ref()
const inputNumber = ref(0)
const inputTextarea = ref()
// #endregion

// #region sm-pagination
const currentPage = ref(5)
const currentPage2 = ref(1)

const itemsToShow = ref(10)
const itemsToShow2 = ref(10)

const onBeforePrevPageChange = (setPrevPage: () => void): void => {
  console.info('beforePrevPageChange')
  // do stuff
  setPrevPage()
}

const onBeforeNextPageChange = (setNextPage: () => void): void => {
  console.info('beforeNextPageChange')
  // do stuff
  setNextPage()
}

const onBeforePageNumberChange = (pageNumber: number, from: number, next: () => void): void => {
  console.info('beforePageNumberChange', pageNumber, from)
  // do stuff
  next()
}

const onBeforePageSizeChange = (to: number, from: number, next: () => void): void => {
  console.info('beforePageSizeChange', to, from)
  // do stuff
  next()
}
// #endregion

// #region sm-multi-select
const generateOptions = (length: number, offset = 0): SmMultiSelectOption[] => Array.from({ length }, (_, index) => ({
  label: `Option ${index + 1 + offset}`,
  code: `${index + 1 + offset}`,
}))

const multiSelect = ref()
const groupedMultiSelect = ref(['9'])
const multiSelectOptions = ref(generateOptions(20))
const groupedMultiSelectOptions = ref<SmMultiSelectGroupOption[]>([
  {
    title: 'Group 1',
    libs: generateOptions(5),
  },
  {
    title: 'Group 2',
    libs: generateOptions(3, 5),
  },
  {
    title: 'Group 3',
    libs: [
      {
        label: 'Option 9',
        code: '9',
        description: 'Disabled option description',
        disabled: true,
      },
      { label: 'Option 10', code: '10', disabled: true },
      { label: 'Option 11', code: '11' }, // test substrings of code: 1, 11, 111
      { label: 'Option 12', code: '12' },
      { label: 'Option 111', code: '111' },
    ],
  },
])
// #endregion

// #region general
const logEvent = (eventName: string, eventType: string, event?: MouseEvent): void => {
  console.info(`${eventName}: ${eventType}`)

  if (event) {
    console.info(event)
  }
}
// #endregion
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />

      <p>{{ t('page-description') }}</p>

      <sm-section data-sm-test-id="sm-badge-section">
        <h2>{{ t('badge.component-name') }}</h2>
        <h3 class="sm-h6">{{ t('label.small') }}</h3>
        <sm-badge type="success" />
        <sm-badge type="info" />
        <sm-badge />
        <sm-badge type="alert" />

        <br><br>

        <h3 class="sm-h6">{{ t('label.medium') }}</h3>
        <sm-badge
          type="success"
          size="medium"
        >
          {{ n(5) }}
        </sm-badge>
        <sm-badge
          type="info"
          size="medium"
        >
          {{ n(20) }}
        </sm-badge>
        <sm-badge
          type="warning"
          size="medium"
        >
          {{ n(30) }}
        </sm-badge>
        <sm-badge
          type="info"
          size="medium"
        >
          {{ t('badge.new') }}
        </sm-badge>
        <sm-badge
          type="alert"
          size="medium"
        >
          {{ n(50) }}
        </sm-badge>

        <br><br>

        <h3 class="sm-h6">{{ t('label.large') }}</h3>
        <sm-badge
          type="success"
          size="large"
        >
          {{ n(5) }}
        </sm-badge>
        <sm-badge
          type="info"
          size="large"
        >
          {{ n(20) }}
        </sm-badge>
        <sm-badge
          type="warning"
          size="large"
        >
          {{ n(30) }}
        </sm-badge>
        <sm-badge
          type="info"
          size="large"
        >
          {{ t('badge.new') }}
        </sm-badge>
        <sm-badge
          type="alert"
          size="large"
        >
          {{ n(50) }}
        </sm-badge>

        <br><br>

        <h3 class="sm-h6">{{ t('label.light') }}</h3>
        <sm-badge
          light-theme-type="success"
          size="large"
        >
          {{ n(5) }}
        </sm-badge>
        <sm-badge
          light-theme-type="info"
          size="large"
        >
          {{ n(20) }}
        </sm-badge>
        <sm-badge
          light-theme-type="warning"
          size="large"
        >
          {{ n(30) }}
        </sm-badge>
        <sm-badge
          light-theme-type="info"
          size="large"
        >
          {{ t('badge.new') }}
        </sm-badge>
        <sm-badge
          light-theme-type="alert"
          size="large"
        >
          {{ n(50) }}
        </sm-badge>

        <br><br>

        <h3 class="sm-h6">{{ t('label.disabled') }}</h3>
        <sm-badge
          type="alert"
          size="large"
          :disabled="true"
        >
          {{ n(50) }}
        </sm-badge>
        <sm-badge
          light-theme-type="success"
          size="large"
          :disabled="true"
        >
          {{ n(50) }}
        </sm-badge>
        <sm-badge :disabled="true" />
      </sm-section>

      <sm-section data-sm-test-id="sm-banner-section">
        <h2>{{ t('banner.component-name') }}</h2>

        <h3 class="sm-h6">{{ t('label.with-icon') }}</h3>
        <sm-banner
          v-model:visible="isVisible"
          :title="t('banner.info')"
          type="info"
          :show-close="true"
          :before-close="handleBeforeClose"
        />

        <br>

        <sm-banner
          v-model:visible="isVisible1"
          :title="t('banner.success')"
          type="success"
          :show-close="true"
          :before-close="handleBeforeClose"
        />

        <br>

        <sm-banner
          v-model:visible="isVisible2"
          :title="t('banner.alert')"
          type="alert"
          :show-close="true"
          :before-close="(cb: () => void) => handleBeforeClose(cb, 'alert custom payload')"
        />

        <br>

        <sm-banner
          v-model:visible="isVisible3"
          :title="t('banner.warning')"
          type="warning"
          :show-close="true"
          :before-close="(cb: () => void) => handleBeforeClose(cb, 'warning custom payload')"
        />

        <br><br>

        <h3 class="sm-h6">{{ t('label.without-icon') }}</h3>
        <sm-banner
          type="info"
          :title="t('banner.info')"
          :visible="true"
        >
          <template #action>
            <sm-button type="tertiary">{{ t('banner.button') }}</sm-button>
          </template>
        </sm-banner>

        <br>

        <sm-banner
          type="success"
          :title="t('banner.success')"
          :show-icon="false"
          :visible="true"
        >
          <template #action>
            <sm-button type="tertiary">{{ t('banner.button') }}</sm-button>
          </template>
        </sm-banner>

        <br>

        <sm-banner
          type="alert"
          :title="t('banner.alert')"
          :show-icon="false"
          :visible="true"
        >
          <template #action>
            <sm-button type="tertiary">{{ t('banner.button') }}</sm-button>
          </template>
        </sm-banner>

        <br>

        <sm-banner
          type="warning"
          :title="t('banner.warning')"
          :show-icon="false"
          :visible="true"
        >
          <template #action>
            <sm-button type="tertiary">{{ t('banner.button') }}</sm-button>
          </template>
        </sm-banner>

        <br><br>

        <h3 class="sm-h6">{{ t('label.text-alignment') }}</h3>
        <sm-banner
          type="info"
          :title="t('banner.info')"
          text-align="start"
          :visible="true"
        >
          <template #action>
            <sm-button type="tertiary">{{ t('banner.button') }}</sm-button>
          </template>
        </sm-banner>

        <br>

        <sm-banner
          type="success"
          :title="t('banner.success')"
          :visible="true"
        >
          <template #action>
            <sm-button type="tertiary">{{ t('banner.button') }}</sm-button>
          </template>
        </sm-banner>
      </sm-section>

      <sm-section data-sm-test-id="sm-button-section">
        <h2>{{ t('button.component-name') }}</h2>

        <div>
          <h3 class="sm-h6">{{ t('label.types') }}</h3>
          <sm-button
            type="primary"
            data-sm-button-test="primary"
          >
            {{ t('button.primary') }}
          </sm-button>
          <sm-button type="secondary">{{ t('button.secondary') }}</sm-button>
          <sm-button type="secondary-warning">{{ t('button.secondary-warning') }}</sm-button>
          <sm-button type="secondary-success">{{ t('button.secondary-success') }}</sm-button>
          <sm-button type="tertiary">{{ t('button.tertiary') }}</sm-button>

          <br><br>

          <sm-button type="success">{{ t('button.success') }}</sm-button>
          <sm-button type="alert">{{ t('button.alert') }}</sm-button>
          <sm-button type="warning">{{ t('button.warning') }}</sm-button>

          <br><br>

          <sm-button type="text">{{ t('button.text') }}</sm-button>
          <sm-button type="text-success">{{ t('button.text-success') }}</sm-button>
          <sm-button type="text-warning">{{ t('button.text-warning') }}</sm-button>
          <sm-button>{{ t('button.default') }}</sm-button>
        </div>

        <br><br>

        <div>
          <h3 class="sm-h6">{{ t('label.sizes') }}</h3>
          <sm-button
            type="primary"
            size="large"
          >
            {{ t('button.large-default') }}
          </sm-button>
          <sm-button
            type="primary"
            size="medium"
          >
            {{ t('button.medium') }}
          </sm-button>
          <sm-button
            type="primary"
            size="small"
          >
            {{ t('button.small') }}
          </sm-button>
          <sm-button
            type="primary"
            size="mini"
          >
            {{ t('button.mini') }}
          </sm-button>
        </div>

        <br><br>

        <div>
          <h3 class="sm-h6">{{ t('label.shapes') }}</h3>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="square"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="square"
            type="text"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="square"
            type="primary"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.edit-button-aria-label')"
            shape="square"
            type="secondary"
          >
            <sm-icon name="action-edit" />
          </sm-button>
          <sm-button
            :aria-label="t('button.save-button-aria-label')"
            shape="square"
            type="tertiary"
          >
            <sm-icon name="rating-default" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="square"
            type="primary"
            size="medium"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="square"
            type="secondary"
            size="medium"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.save-button-aria-label')"
            shape="square"
            type="tertiary"
            size="medium"
          >
            <sm-icon name="rating-default" />
          </sm-button>

          <br><br>

          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="round"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="round"
            type="text"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="round"
            type="primary"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.edit-button-aria-label')"
            shape="round"
            type="secondary"
          >
            <sm-icon name="action-edit" />
          </sm-button>
          <sm-button
            :aria-label="t('button.save-button-aria-label')"
            shape="round"
            type="tertiary"
          >
            <sm-icon name="rating-default" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="round"
            type="primary"
            size="medium"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.close-button-aria-label')"
            shape="round"
            type="secondary"
            size="medium"
          >
            <sm-icon name="action-cross" />
          </sm-button>
          <sm-button
            :aria-label="t('button.save-button-aria-label')"
            shape="round"
            type="tertiary"
            size="medium"
          >
            <sm-icon name="rating-default" />
          </sm-button>
        </div>
      </sm-section>

      <sm-section data-sm-test-id="sm-divider-section">
        <h2>{{ t('divider.component-name') }}</h2>

        <h3 class="sm-h6">{{ t('label.standard') }}</h3>
        <sm-divider />

        <br><br>

        <h3 class="sm-h6">{{ t('label.custom-margin') }}</h3>
        <sm-divider
          margin-top="3.5rem"
          margin-bottom="3.5rem"
        />
      </sm-section>

      <sm-section data-sm-test-id="sm-expandable-card-section">
        <h2>{{ t('expandable-card.component-name') }}</h2>

        <sm-expandable-card>
          <template #header>
            {{ t('expandable-card.header') }}
          </template>

          <template #footer>
            <sm-button
              type="text"
              prefix-icon="controls-add"
            >
              {{ t('expandable-card.add-card-button') }}
            </sm-button>
          </template>

          <template #body>
            <sm-expandable-card-body content-class="sm-overflow-visible">
              <template #header>
                {{ t('expandable-card.header') }}
              </template>
              <template #body>
                {{ t('expandable-card.body') }}
              </template>
            </sm-expandable-card-body>
          </template>
        </sm-expandable-card>

        <br>

        <h3 class="sm-h6">
          {{ t('label.standard') }}
        </h3>
        <sm-expandable-card-body
          :expanded="isExpandable"
          :show-outer-border="true"
          @open="openExpandableCard"
          @close="closeExpandableCard"
        >
          <template #header>
            {{ t('expandable-card.header') }}
          </template>
          <template #body>
            <div>{{ t('expandable-card.body') }}</div>
            <div>{{ t('expandable-card.body') }}</div>
            <div>{{ t('expandable-card.body') }}</div>
          </template>
        </sm-expandable-card-body>

        <br><br>

        <h3 class="sm-h6">{{ t('label.nested') }}</h3>
        <sm-expandable-card-body
          arrow-position="right"
          :expanded="isLevelOneExpanded"
          :show-outer-border="true"
          @open="openExpandableCard('level 1')"
          @close="closeExpandableCard('level 1')"
        >
          <template #header>
            {{ t('expandable-card.header-level-one') }}
          </template>
          <template #body>
            <sm-expandable-card-body
              arrow-position="left"
              :expanded="isLevelTwoExpanded"
              :show-outer-border="true"
              @open="openExpandableCard('level 2')"
              @close="closeExpandableCard('level 2')"
            >
              <template #header>
                {{ t('expandable-card.header-level-two') }}
              </template>
              <template #body>
                <div>{{ t('expandable-card.body') }}</div>
                <div>{{ t('expandable-card.body') }}</div>
                <div>{{ t('expandable-card.body') }}</div>
              </template>
            </sm-expandable-card-body>
          </template>
        </sm-expandable-card-body>
      </sm-section>

      <sm-section data-sm-test-id="sm-help-card-section">
        <h2>{{ t('help-card.component-name') }}</h2>

        <sm-help-card>
          <template #header>{{ t('help-card.header') }}</template>
        </sm-help-card>

        <sm-help-card type="warning">
          <template #header>{{ t('help-card.header') }}</template>
        </sm-help-card>

        <sm-help-card type="success">
          <template #header>{{ t('help-card.header') }}</template>
        </sm-help-card>

        <sm-help-card type="alert">
          <template #header>{{ t('help-card.header') }}</template>
        </sm-help-card>

        <sm-help-card>
          <template #header>{{ t('help-card.header') }}</template>
          <template #body>{{ t('help-card.body') }}</template>
        </sm-help-card>

        <sm-help-card type="alert">
          <template #header>{{ t('help-card.header') }}</template>
          <template #body>{{ t('help-card.body') }}</template>
        </sm-help-card>

        <sm-help-card type="warning">
          <template #header>{{ t('help-card.header') }}</template>
          <template #body>{{ t('help-card.body') }}</template>
        </sm-help-card>

        <sm-help-card type="success">
          <template #header>{{ t('help-card.header') }}</template>
          <template #body>{{ t('help-card.body') }}</template>
        </sm-help-card>

        <sm-help-card type="warning">
          <template #body>
            <sm-icon
              name="utility-warning"
              class="mr-4 text-app-warning"
            />
            {{ t('help-card.body-only') }}
          </template>
        </sm-help-card>
      </sm-section>

      <sm-section data-sm-test-id="sm-loader-section">
        <h2>{{ t('loader.component-name') }}</h2>

        <sm-loader />
      </sm-section>

      <sm-section data-sm-test-id="sm-icon-section">
        <h2>{{ t('icon.component-name') }}</h2>

        <div class="sm-text--disabled">
          <sm-icon name="amenity-bathroom" />
        </div>
        <br>
        <div>
          <sm-icon
            name="section-social"
            class="cm-icon cm-icon--large"
            alt="Small Badge"
          >
            <template #badge>
              <sm-badge type="success" />
            </template>
          </sm-icon>
        </div>
        <br>
        <div>
          <sm-icon
            name="section-social"
            class="cm-icon cm-icon--large"
            alt="Medium Badge"
          >
            <template #badge>
              <sm-badge
                type="success"
                size="medium"
              >
                {{ n(5) }}
              </sm-badge>
            </template>
          </sm-icon>
        </div>
      </sm-section>

      <sm-section data-sm-test-id="sm-404-page-section">
        <h2>{{ t('404-page.component-name') }}</h2>

        <sm-404-page>
          <template #image>
            <img
              alt=""
              role="presentation"
              src="https://sui-assets.siteminder.com/sm/illu-lg/non-payment.svg"
            >
          </template>
          <template #header>
            <h3 class="mb-8">{{ t('404-page.title') }}</h3>
          </template>
          <template #description>
            {{ t('404-page.description') }}
          </template>
          <template #actions>
            <sm-button type="secondary">{{ t('404-page.secondary-action') }}</sm-button>
            <sm-button type="primary">{{ t('404-page.primary-action') }}</sm-button>
          </template>
        </sm-404-page>
      </sm-section>

      <sm-section data-sm-test-id="sm-input-section">
        <h2>{{ t('input.component-name') }}</h2>

        <div class="cm-max-w-lg">
          <sm-input
            v-model="inputName"
            name="name"
            :label="t('input.name-label')"
            :placeholder="t('input.name-placeholder')"
            rules="required"
          />
          <sm-input
            v-model="inputEmail"
            type="email"
            prefix-icon="action-email"
            name="email"
            :rules="{
              required: true,
              email: true
            }"
            :label="t('input.email-label')"
            :placeholder="t('input.email-placeholder')"
          />
          <sm-input
            v-model="inputEmail2"
            type="email2"
            prefix-icon="action-email"
            name="email"
            mode="lazy"
            :help-text="t('input.email-help-text')"
            :rules="{
              required: true,
              email: true
            }"
            :label="t('input.email-label')"
            :placeholder="t('input.email-placeholder')"
          />
          <sm-input
            v-model.number="inputNumber"
            type="number"
            name="number"
            rules="min_value:1"
            :controls="true"
            :label="t('input.number-with-controls-label')"
          />
          <sm-input
            v-model="inputTextarea"
            type="textarea"
            maxlength="30"
            name="textarea"
            rules="required"
            :counter="true"
            :label="t('input.text-area-label')"
          />
        </div>
      </sm-section>

      <sm-section data-sm-test-id="sm-pagination">
        <h2>{{ t('pagination.component-name') }}</h2>

        <h3 class="sm-h6">{{ t('label.standard') }}</h3>
        <sm-pagination
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsToShow"
          :max-visible-buttons="7"
          :total-items="91"
          :before-page-number-change="onBeforePageNumberChange"
          :before-page-size-change="onBeforePageSizeChange"
          :before-prev-page-change="onBeforePrevPageChange"
          :before-next-page-change="onBeforeNextPageChange"
        />
        <br><br>

        <h3 class="sm-h6">{{ t('label.expanded') }}</h3>
        <sm-pagination
          v-model:current-page="currentPage2"
          v-model:items-per-page="itemsToShow2"
          type="expanded"
          :show-go-to-input="false"
          :max-visible-buttons="9"
          :total-items="1001"
          :before-page-number-change="onBeforePageNumberChange"
          :before-page-size-change="onBeforePageSizeChange"
          :before-prev-page-change="onBeforePrevPageChange"
          :before-next-page-change="onBeforeNextPageChange"
        />
      </sm-section>

      <sm-section data-sm-test-id="sm-multi-select-section">
        <h2>{{ t('multi-select.component-name') }}</h2>

        <div class="cm-max-w-lg">
          <sm-multi-select
            v-model="multiSelect"
            footer-class="cm-flex-row-start"
            name="multiselect1"
            rules="required"
            :label="t('multi-select.label-standard')"
            :placeholder="t('multi-select.placeholder')"
            :options="multiSelectOptions"
          >
            <template #footer>
              <div class="cm-w-full">
                <sm-button
                  type="text"
                  @click="logEvent('Multi-select footer button', 'click')"
                >
                  {{ t('multi-select.footer-action') }}
                </sm-button>
              </div>
            </template>
          </sm-multi-select>
          <sm-multi-select
            v-model="groupedMultiSelect"
            name="multiselect2"
            rules="required"
            :label="t('multi-select.label-grouped')"
            :multiple="true"
            :options="groupedMultiSelectOptions"
            :placeholder="t('multi-select.placeholder')"
            :show-group-select="true"
          />
        </div>
      </sm-section>

      <sm-section
        id="sm-hint-card-section"
        data-sm-test-id="sm-hint-card-section"
      >
        <h2>{{ t('hint-card.component-name') }}</h2>

        <div class="cm-flex cm-flex-col cm-flex-row--gap-8 cm-place-items-stretch">
          <sm-hint-card :title="t('hint-card.title')" />

          <sm-hint-card :body="t('hint-card.body')" />

          <sm-hint-card
            title-tag="h3"
            :body="t('hint-card.body')"
            :title="t('hint-card.title')"
          />

          <sm-hint-card>
            <template #title>
              {{ t('hint-card.title') }}
            </template>
            <template #body>
              {{ t('hint-card.body') }}
            </template>
          </sm-hint-card>

          <sm-hint-card
            :title="t('hint-card.title')"
            :action-button="{
              label: t('hint-card.action-button-label'),
              suffixIcon: 'arrow-go-forward',
              onClick: (e: MouseEvent) => logEvent('sm-hint-card action button', 'click', e),
            }"
          />

          <sm-hint-card
            :body="t('hint-card.body')"
            :action-button="{
              label: t('hint-card.action-button-label'),
              suffixIcon: 'action-open-in-new',
              href: 'https://www.siteminder.com/',
              target: '_blank',
            }"
          />

          <sm-hint-card
            title-tag="h3"
            :title="t('hint-card.title')"
            :body="t('hint-card.body')"
            :action-button="{
              label: t('hint-card.action-button-label'),
              suffixIcon: 'arrow-go-forward',
              to: '/dashboard',
            }"
          />

          <sm-hint-card>
            <template #title>
              {{ t('hint-card.title') }}
            </template>
            <template #body>
              {{ t('hint-card.body') }}
            </template>
            <template #action>
              <sm-button
                size="medium"
                :type="SmButtonType.TEXT"
              >
                {{ t('hint-card.action-button-label') }}
              </sm-button>
            </template>
          </sm-hint-card>

          <sm-hint-card
            title-tag="h3"
            :title="t('hint-card.title')"
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          />

          <sm-hint-card
            :body="t('hint-card.body')"
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          />

          <sm-hint-card
            title-tag="h3"
            :body="t('hint-card.body')"
            :title="t('hint-card.title')"
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          />

          <sm-hint-card
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          >
            <template #title>
              {{ t('hint-card.title') }}
            </template>
            <template #body>
              {{ t('hint-card.body') }}
            </template>
          </sm-hint-card>

          <sm-hint-card
            :title="t('hint-card.title')"
            :action-button="{
              label: t('hint-card.action-button-label'),
              suffixIcon: 'arrow-go-forward',
              onClick: (e: MouseEvent) => logEvent('sm-hint-card action button', 'click', e),
            }"
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          />

          <sm-hint-card
            :body="t('hint-card.body')"
            :action-button="{
              label: t('hint-card.action-button-label'),
              suffixIcon: 'arrow-go-forward',
              to: '/dashboard',
            }"
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          />

          <sm-hint-card
            title-tag="h3"
            :body="t('hint-card.body')"
            :title="t('hint-card.title')"
            :action-button="{
              label: t('hint-card.action-button-label'),
              suffixIcon: 'action-open-in-new',
              href: 'https://www.siteminder.com/',
              target: '_blank',
            }"
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          />

          <sm-hint-card
            :show-close="true"
            @close="logEvent('sm-hint-card close button', 'click')"
          >
            <template #title>
              {{ t('hint-card.title') }}
            </template>
            <template #body>
              {{ t('hint-card.body') }}
            </template>
            <template #action>
              <sm-button
                size="medium"
                :type="SmButtonType.TEXT"
              >
                {{ t('hint-card.action-button-label') }}
              </sm-button>
            </template>
          </sm-hint-card>
        </div>
      </sm-section>
    </sm-container>
  </sm-section>
</template>
