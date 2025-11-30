<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  SmCalendar,
  SmCalendarDateParts,
  SmCalendarMask,
  SmCalendarMode,
  SmCalendarPosition,
} from '@siteminder/sui-core/components/forms/sm-calendar'
import { SmButtonType } from '@siteminder/sui-core/components/sm-button'
import { SmDropdown, SmDropdownPlacement } from '@siteminder/sui-core/components/sm-dropdown'
import { SmRadio, SmRadioButton, SmRadioButtonAlignment, SmRadioGroup } from '@siteminder/sui-core/components/forms/sm-radio'
import { SmLoadingCard } from '@siteminder/sui-core/components/loading/sm-loading-card'
import { useGetCamp } from '@/composables/use-get-camp'
import { useDialogService } from '@/composables/use-dialog-service'
import { useToastService } from '@/composables/use-toast-service'
import { useTranslate } from '@/composables/use-translate'
import { Campsite } from '@/views/sites-and-rates/campsites.types'

/**
 * IMPORTANT:
 *
 * This is a demo for sm-accordion with complex content and interfaces which
 * is also hooked into the edit drawer and form fields.
 *
 * If you are planning to add more fields within the drawer, please make sure
 * to add in the existing logic around the following:
 * - Prefilled form fields matches the accordion data
 * - Draft state in the drawer, edited form fields should not be reflected on the accordion until saved
 * - Discard changes prompt on unsaved data when attempting to close the drawer
 * - Error and success toasts when saving the form
 * - Accordion updates when form is saved successfully
 */

const { t } = useTranslate('views.sites-and-rates.campsites')

const { showPromptDialog } = useDialogService()
const { showAlertToast, showSuccessToast } = useToastService()

interface FormRef {
  observerRef: {
    valid: boolean
    validate: () => Promise<{ valid: boolean }>
  }
}

interface CampsiteAccordion extends Campsite {
  expanded: boolean
}

interface Accommodation {
  label: string
  code: string
}

const { loading, accommodations, onResult } = useGetCamp('12345')

// sm-accordion list
const campsites = ref<CampsiteAccordion[]>([])
const campsiteAccommodations = computed(() => {
  return campsites.value[0]?.accommodations.map(campsiteAccommodation => accommodations.value.find(accommodation => accommodation?.code === campsiteAccommodation)?.label ?? '') ?? []
})

const expandedAccordions = ref(false)

const toggleAllAccordions = (): void => {
  expandedAccordions.value = !expandedAccordions.value

  campsites.value.forEach((campsite) => {
    campsite.expanded = expandedAccordions.value
  })
}

onResult(({ data }) => {
  campsites.value = data.camp.campsites.map((campsite) => {
    let thumbnailImageSrc = campsite?.thumbnailImageSrc ?? ''

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, import/no-dynamic-require, global-require
      thumbnailImageSrc = require(`@/assets/images/${thumbnailImageSrc}`)
    } catch (err) {
      // fail silently
    }

    return {
      ...campsite,
      thumbnailImageSrc,
      expanded: false,
    }
  }) as unknown as CampsiteAccordion[]
})

// sm-dropdown
const activeCampsiteId = ref<number>()

// sm-drawer form
const editDrawerVisible = ref(false)
// Return a copy of the data so that the form is not bound to the accordions
const editCampsiteForm = ref<Campsite>({
  id: 0,
  name: '',
  description: '',
  accommodations: [],
  applicableStartDate: null,
  advertisedDateRange: {
    start: null,
    end: null,
  },
  maximumAdvanceBookingDays: false,
  dynamicDiscounts: false,
  restrictToMobile: false,
  smokingPolicy: 'non-smoking',
  allowPets: false,
})
const isFormSaving = ref(false)
const formRef = ref()

// Prompts are valid pattern in SUI
// https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/?path=/story/components-dialog-overview--page#prompts
const editDrawerHasUnsavedChanges = computed(() => {
  // Quick comparison for objects since we're just dealing with simple data
  const editIndex = (activeCampsiteId.value ?? 0) - 1
  const draftState = JSON.stringify(editCampsiteForm.value)
  const previousState = JSON.stringify(campsites.value[editIndex] ?? {})

  return draftState !== previousState
})

const asyncTimeout = (delay = 2000): Promise<unknown> => new Promise((resolve) => { setTimeout(resolve, delay) })

const onDrawerBeforeClose = (closeDrawer: () => void): void => {
  console.info('drawer before close handler:', editCampsiteForm.value.name)

  if (editDrawerHasUnsavedChanges.value) {
    showPromptDialog({
      title: t('discard-changes-dialog-title'),
      bodyContent: t('discard-changes-dialog-message'),
      cancelButtonText: t('discard-changes-dialog-cancel-button'),
      confirmButtonText: t('discard-changes-dialog-confirm-button'),
      closeOnClickModal: false,
      closeOnPressEscape: false,
      beforeClose: (closeDialog: () => void) => {
        // Close the dialog without closing the drawer
        closeDialog()
      },
      beforeConfirm: (confirm: () => void) => {
        // Close the dialog first
        confirm()

        // Then close the drawer
        closeDrawer()
      },
    })
  } else {
    // Close drawer right away
    closeDrawer()
  }
}

const openEditDrawer = (id: number): void => {
  editDrawerVisible.value = true
  activeCampsiteId.value = id
  editCampsiteForm.value = { ...campsites.value[id - 1] }
}

const getUpdatedCampsites = (): CampsiteAccordion[] => {
  return campsites.value.slice(0)
    .map((campsite) => {
      if (campsite.id === activeCampsiteId.value) {
        return {
          ...campsites.value[activeCampsiteId.value - 1],
          ...editCampsiteForm.value,
        }
      }

      return campsite
    })
}

const saveCampsite = async (): Promise<void> => {
  console.info(`saving: ${JSON.stringify(editCampsiteForm.value, undefined, 2)}`)
  isFormSaving.value = true

  // Delay to simulate API call and show loading states
  await asyncTimeout()

  if (!activeCampsiteId.value || !campsites.value[activeCampsiteId.value - 1]) {
    return
  }

  isFormSaving.value = false

  // NOTE: This is a breaking change in sui-core
  // previously sm-form exposed `validate` and `reset` functions but has since been deleted.
  // downstream projects used to do:
  // const isValid = await (formRef.value as FormRef).validate()
  const validateResults = await (formRef.value as FormRef).observerRef.validate()
  if (!validateResults.valid) {
    // Then simulate error
    showAlertToast(t('save-campsite-details-failed-toast-message'), { title: t('save-campsite-details-failed-toast-title') })
    return
  }

  // success
  // "Save" the data so it's reflected on the accordions
  campsites.value = getUpdatedCampsites()

  // Then simulate success
  showSuccessToast(t('save-campsite-details-success-toast-message'), { title: t('save-campsite-details-success-toast-title') })
}
// #region sm-calendar
const handleCalendarEvent = (name: string, value: unknown): void => {
  console.info(name, value)
}

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1
const minApplicableDisabledDates: SmCalendarDateParts[] = [
  { year, month: 1 },
  { year, month: 12 },
  { year: year + 1, month: 1 },
  { year: year + 1, month: 12 },
]
const minApplicableStartDate: SmCalendarDateParts = { year, month }
const maxApplicableEndDate: SmCalendarDateParts = { year: year + 1, month: 12 }
const calendarMask: SmCalendarMask = { input: 'MMMM YYYY' }
// #end-region
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-breadcrumbs class="cm-mb-24">
        <sm-breadcrumb-item :to="{ name: 'sites-and-rates' }">{{ t('sites-and-rates') }}</sm-breadcrumb-item>
        <sm-breadcrumb-item>{{ t('page-title') }}</sm-breadcrumb-item>
      </sm-breadcrumbs>

      <sm-page-title
        :title="t('page-title')"
        :sub-title="`(${campsites.length})`"
      />

      <div class="cm-flex cm-mb-24 cm-place-content-end">
        <sm-button
          type="text"
          :prefix-icon="expandedAccordions ? 'action-collapse' : 'action-expand-all'"
          @click="toggleAllAccordions"
        >
          <template v-if="expandedAccordions">{{ t('collapse-all') }}</template>
          <template v-else>{{ t('expand-all') }}</template>
        </sm-button>
      </div>

      <sm-loading-card
        v-if="loading"
        count="4"
        :stacked="true"
      />

      <template v-else>
        <sm-accordion
          v-for="campsite in campsites"
          :key="campsite.id"
          :expanded="campsite.expanded"
          @collapse="campsite.expanded = false"
          @expanded="campsite.expanded = true"
        >
          <template #header>
            <div
              class="cm-flex cm-place-content-between cm-place-items-stretch cm-relative"
            >
              <div class="campsites__content">
                <h2 class="campsites__name sm-h6">
                  {{ campsite.name }}
                </h2>
                <div class="cm-flex cm-flex-column--gap-24 cm-flex-wrap">
                  <span
                    v-for="index in 3"
                    :key="index"
                    class="cm-flex cm-flex-column--gap-8"
                  >
                    <sm-icon name="amenities" /> {{ t('amenities') }} {{ index }}
                  </span>
                </div>
              </div>
              <sm-accordion-graphic
                v-if="campsite.thumbnailImageSrc"
                :class="{
                  'campsites__image': true,
                  'campsites__image--expanded': campsite.expanded,
                  'cm-mr-0': true,
                }"
                :src="campsite.thumbnailImageSrc"
                :alt="campsite.name"
              />
              <div class="cm-absolute cm-pr-16 cm-right-0 cm-top-0">
                <sm-dropdown
                  active-label="ACTIONS"
                  :type="SmButtonType.TERTIARY"
                  :placement="SmDropdownPlacement.BOTTOM"
                  :square="true"
                >
                  <template #label>
                    <sm-icon
                      :aria-label="t('dropdown.aria-label')"
                      name="action-context-menu"
                    />
                  </template>

                  <template #default>
                    <sm-vertical-nav>
                      <sm-vertical-nav-item
                        :label="t('dropdown.edit')"
                        @click="openEditDrawer(campsite.id)"
                      />
                    </sm-vertical-nav>
                  </template>
                </sm-dropdown>
              </div>
            </div>
          </template>
          <template #default>
            <span class="cm-font-bold">{{ t('accordion.description-label') }}</span>
            <sm-text-truncator
              v-if="campsite.description"
              class="cm-mb-24"
              :clamp-line="2"
              :show-more-text="t('accordion.read-more')"
              :show-less-text="t('accordion.read-less')"
            >
              {{ campsite.description }}
            </sm-text-truncator>
            <p v-else>
              <em>{{ t('accordion.no-description') }}</em>
            </p>

            <span class="cm-font-bold">{{ t('accordion.accommodations-label') }}</span>
            <p>
              <template v-if="campsiteAccommodations.length">
                {{ campsiteAccommodations.join(', ') }}
              </template>
              <em v-else>{{ t('accordion.no-accommodations') }}</em>
            </p>

            <span class="cm-font-bold">{{ t('accordion.smoking-policy-label') }}</span>
            <p>
              {{ campsite.smokingPolicy === 'non-smoking' ? t('accordion.non-smoking') : t('accordion.smoking') }}
            </p>

            <span class="cm-font-bold">{{ t('accordion.allow-pets-label') }}</span>
            <p>
              {{ campsite.allowPets ? t('accordion.yes') : t('accordion.no') }}
            </p>

            <span class="cm-font-bold">{{ t('accordion.booking-controls-label') }}</span>
            <p>
              {{ t('drawer.form.maximum-advance-booking-dates-label') }}: {{ campsite.maximumAdvanceBookingDays ? t('accordion.yes') : t('accordion.no') }} <br>
              {{ t('drawer.form.dynamic-discounts-label') }}: {{ campsite.dynamicDiscounts ? t('accordion.yes') : t('accordion.no') }} <br>
              {{ t('drawer.form.restrict-to-mobile-label') }}: {{ campsite.restrictToMobile ? t('accordion.yes') : t('accordion.no') }} <br>
            </p>
          </template>
        </sm-accordion>
      </template>
    </sm-container>

    <sm-drawer
      v-model:visible="editDrawerVisible"
      content-class="sm-drawer__fixed-width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :action-buttons-visible="true"
      :before-close="onDrawerBeforeClose"
      :title="t('drawer.title')"
    >
      <!-- New slot prop support in Vue3 to avoid template refs -->
      <template #actions="{ close }">
        <sm-button
          type="tertiary"
          :disabled="isFormSaving"
          @click="close"
        >
          {{ t('drawer.cancel-button') }}
        </sm-button>
        <sm-button
          type="primary"
          :disabled="isFormSaving"
          :loading="isFormSaving"
          @click="saveCampsite"
        >
          {{ t('drawer.save-button') }}
        </sm-button>
      </template>

      <template #mobile-actions="{ close }">
        <sm-button
          type="tertiary"
          :disabled="isFormSaving"
          @click="close"
        >
          {{ t('drawer.cancel-button') }}
        </sm-button>
        <sm-button
          type="primary"
          :disabled="isFormSaving"
          :loading="isFormSaving"
          @click="saveCampsite"
        >
          {{ t('drawer.save-button') }}
        </sm-button>
      </template>

      <!--
        Remove from DOM to refresh the validation states, in the future we can
        move the drawer into a router-view to avoid this and mimic what PP does
      -->
      <template
        v-if="activeCampsiteId && editDrawerVisible"
        #default
      >
        <sm-form
          ref="formRef"
          :disabled="isFormSaving"
        >
          <sm-form-group :legend="t('drawer.form.general-information')">
            <sm-input
              v-model="editCampsiteForm.name"
              name="campsite-name"
              rules="required"
              :label="t('drawer.form.campsite-name-label')"
            />

            <sm-input
              v-model="editCampsiteForm.description"
              type="textarea"
              name="campsite-description"
              :label="t('drawer.form.campsite-description-label')"
              :counter="true"
              :maxlength="600"
            />
          </sm-form-group>

          <sm-divider margin-bottom="32px" />

          <sm-form-group :legend="t('drawer.form.features')">
            <sm-select
              v-model="editCampsiteForm.accommodations"
              name="accommodations"
              :multiple="true"
              :options="accommodations"
              :label="t('drawer.form.accommodations-label')"
              :placeholder="t('drawer.form.accommodations-placeholder')"
            />

            <sm-radio-group
              name="smoking-policy"
              :label="t('drawer.form.smoking-policy-label')"
              :block="true"
            >
              <sm-radio-button
                v-model="editCampsiteForm.smokingPolicy"
                name="smoking-policy"
                selected-value="non-smoking"
                :label="t('drawer.form.non-smoking-label')"
              />
              <sm-radio-button
                v-model="editCampsiteForm.smokingPolicy"
                name="smoking-policy"
                selected-value="smoking"
                :label="t('drawer.form.smoking-label')"
              />
            </sm-radio-group>

            <sm-radio-group
              :button-alignment="SmRadioButtonAlignment.HORIZONTAL"
              name="allow-pets"
              :label="t('drawer.form.allow-pets-label')"
            >
              <sm-radio
                v-model="editCampsiteForm.allowPets"
                name="allow-pets"
                :selected-value="true"
                :label="t('drawer.form.yes-label')"
              />
              <sm-radio
                v-model="editCampsiteForm.allowPets"
                name="allow-pets"
                :selected-value="false"
                :label="t('drawer.form.no-label')"
              />
            </sm-radio-group>
          </sm-form-group>

          <sm-divider margin-bottom="32px" />

          <sm-form-group :legend="t('drawer.form.booking-controls')">
            <sm-calendar
              v-model="editCampsiteForm.applicableStartDate"
              :label="t('applicable-start-date-calendar-label')"
              placeholder="YYYY-MM"
              prefix-icon="action-calendar"
              rules="required"
              :mode="SmCalendarMode.MONTH_YEAR"
              name="applicable-start-date"
              :masks="calendarMask"
              :disabled-dates="minApplicableDisabledDates"
              :min-date="minApplicableStartDate"
              :max-date="maxApplicableEndDate"
              :help-text="t('applicable-start-date-calendar-help-text')"
              :position="SmCalendarPosition.ABSOLUTE"
              @change="handleCalendarEvent('change', $event)"
              @month-selected="handleCalendarEvent('monthSelected', $event)"
            />

            <sm-calendar
              v-model="editCampsiteForm.advertisedDateRange"
              :label="t('advertised-date-range-calendar-label')"
              :start-date-placeholder="t('advertised-date-range-calendar-start-date-placeholder-text')"
              :end-date-placeholder="t('advertised-date-range-calendar-end-date-placeholder-text')"
              rules="required"
              :mode="SmCalendarMode.MONTH_YEAR"
              prefix-icon="action-calendar"
              :masks="{ input: 'MMMM YYYY' }"
              :is-range="true"
              name="advertised-date-range"
              @change="handleCalendarEvent('change', $event)"
              @start-month-selected="handleCalendarEvent('startMonthSelected', $event)"
              @end-month-selected="handleCalendarEvent('endMonthSelected', $event)"
            />
            <sm-switch-group>
              <sm-switch
                v-model="editCampsiteForm.maximumAdvanceBookingDays"
                name="advance-booking-dates"
                :label="t('drawer.form.maximum-advance-booking-dates-label')"
              />
              <sm-switch
                v-model="editCampsiteForm.dynamicDiscounts"
                name="dynamic-discounts"
                :label="t('drawer.form.dynamic-discounts-label')"
              />
              <sm-switch
                v-model="editCampsiteForm.restrictToMobile"
                :disabled="true"
                name="restrict-to-mobile"
              >
                <template #label>
                  {{ t('drawer.form.restrict-to-mobile-label') }}
                  <sm-tooltip
                    placement="right"
                    :title="t('drawer.form.restrict-to-mobile-tooltip')"
                    trigger="hover"
                  >
                    <sm-icon name="utility-information-alt" />
                  </sm-tooltip>
                </template>
              </sm-switch>
            </sm-switch-group>
          </sm-form-group>
        </sm-form>
      </template>
    </sm-drawer>
  </sm-section>
</template>

<style lang="scss" scoped>
/**
 * This is a demo for sm-accordion with complex content and interfaces which
 * SUI doesn't support right out of the box. Also please note this is not the "official"
 * guide/pattern since there is no mobile support in our design mockups in
 * https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?type=design&node-id=12-150439&mode=design&t=zyDnubhMPGUjv2zD-0
 */
.campsites {
  /**
   * Custom style here since sm-accordion-graphic doesn't specify the dimensions
   * and we needed the extra optimizations to properly place and align the
   * accordion graphic to the far right
   */
  &__image {
    display: none;
    border-top-right-radius: var(--sm-8);
    border-bottom-right-radius: var(--sm-8);
    flex-shrink: 0;
    height: auto;
    min-height: 150px;
    width: 248px;
    transition: border-radius 0.2s ease;

    &--expanded {
      border-bottom-right-radius: 0;
    }

    @media only screen and (min-width: 769px) {
      display: block;
    }
  }

  &__content {
    max-width: calc(100% - 72px);
    word-break: break-word;
  }

  &__name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }
}
</style>
