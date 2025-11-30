<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import { useTranslate } from '@/composables/use-translate'
import { accommodationsData, campsitesData } from '@/mocks/campsites'
import { Campsite } from '@/views/sites-and-rates/campsites.types'
import { useDialogService } from '@/composables/use-dialog-service'
import { useToastService } from '@/composables/use-toast-service'

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
  validate: () => Promise<boolean>
}

interface CampsiteAccordion extends Campsite {
  expanded: boolean
}

// sm-select options
const accommodations = ref(accommodationsData.slice())

// sm-accordion list
const campsites = ref<CampsiteAccordion[]>(campsitesData.map((campsite: Campsite) => ({
  ...campsite,
  expanded: false,
})))

const expandedAccordions = ref(false)

const toggleAllAccordions = (): void => {
  expandedAccordions.value = !expandedAccordions.value

  campsites.value.forEach((campsite) => {
    campsite.expanded = expandedAccordions.value
  })
}

// sm-dropdown
const activeCampsiteId = ref<number>()

// sm-drawer form
// Although we're discouraging use of template refs in general, here's one use
// case wherein we need to access the drawer instance to close it from the action slots.
// Simply updating the `editDrawerVisible` to false won't trigger the necessary
// before close handler.
// In Vue3, we will introduce a `close` slot prop in `actions` and `mobile-actions` slot
const editDrawerRef = ref()
const editDrawerVisible = ref(false)
// Return a copy of the data so that the form is not bound to the accordions
const editCampsiteForm: Ref<Campsite> = ref({
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
  const validateResults = await (formRef.value as FormRef).validate()
  // const validateResults = await (formRef.value as FormRef).observerRef.validate()
  if (!validateResults) {
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
const dayOne = ref([
  { id: '1', label: t('list.dayOne.activityOne') },
  { id: '2', label: t('list.dayOne.activityTwo') },
  { id: '3', label: t('list.dayOne.activityThree') },
])

const dayTwo = ref([
  { id: '4', label: t('list.dayTwo.activityOne') },
  { id: '5', label: t('list.dayTwo.activityTwo') },
  { id: '6', label: t('list.dayTwo.activityThree') },
])

const defaultColor = ref('#488ED9')
const displayPicker = ref<boolean | null>(null)

const defaultColorOne = ref('#FF1B1B')
const displayPickerOne = ref<boolean | null>(null)

// #region sm-calendar
const handleCalendarEvent = (name: string, value: unknown): void => {
  console.info(name, value)
}

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1
const minApplicableDisabledDates = [
  { year, month: 1 },
  { year, month: 12 },
  { year: year + 1, month: 1 },
  { year: year + 1, month: 12 },
]
const minApplicableStartDate = { year, month }
const maxApplicableEndDate = { year: year + 1, month: 12 }
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
                type="tertiary"
                active-label="ACTIONS"
                placement="bottom"
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
            <template v-if="campsite.accommodations.length">
              {{ campsite.accommodations.join(', ') }}
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
    </sm-container>

    <sm-drawer
      ref="editDrawerRef"
      :visible.sync="editDrawerVisible"
      content-class="sm-drawer__fixed-width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :action-buttons-visible="true"
      :before-close="onDrawerBeforeClose"
      :title="t('drawer.title')"
    >
      <template #actions>
        <sm-button
          class="ml-4"
          type="tertiary"
          :disabled="isFormSaving"
          @click="editDrawerRef.close()"
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

      <template #mobile-actions>
        <sm-button
          type="tertiary"
          :disabled="isFormSaving"
          @click="editDrawerRef.close()"
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
              rules="required"
              :label="t('drawer.form.campsite-name-label')"
            />

            <sm-input
              v-model="editCampsiteForm.description"
              type="textarea"
              :label="t('drawer.form.campsite-description-label')"
              :counter="true"
              :maxlength="600"
            />
          </sm-form-group>

          <sm-divider margin-bottom="32px" />

          <sm-form-group :legend="t('drawer.form.features')">
            <sm-select
              v-model="editCampsiteForm.accommodations"
              :multiple="true"
              :options="accommodations"
              :label="t('drawer.form.accommodations-label')"
              :placeholder="t('drawer.form.accommodations-placeholder')"
            />

            <sm-radio-group
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
              button-alignment="horizontal"
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
              mode="month-year"
              name="applicable-start-date"
              :masks="{ input: 'MMMM YYYY' }"
              :disabled-dates="minApplicableDisabledDates"
              :min-date="minApplicableStartDate"
              :max-date="maxApplicableEndDate"
              :help-text="t('applicable-start-date-calendar-help-text')"
              @change="handleCalendarEvent('change', $event)"
              @month-selected="handleCalendarEvent('monthSelected', $event)"
            />

            <sm-calendar
              v-model="editCampsiteForm.advertisedDateRange"
              :label="t('advertised-date-range-calendar-label')"
              :start-date-placeholder="t('advertised-date-range-calendar-start-date-placeholder-text')"
              :end-date-placeholder="t('advertised-date-range-calendar-end-date-placeholder-text')"
              rules="required"
              mode="month-year"
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

    <sm-section>
      <sm-container :full-width="true">
        <h2>{{ t('list.title') }}</h2>
        <p>{{ t('list.description') }}</p>
        <div class="cm-flex cm-flex-row--gap-12 cm-flex-wrap cm-place-items-start">
          <div class="cm-flex-1 cm-min-w-248">
            <h3 class="sm-section-heading--large">{{ t('list.dayOne.title') }}</h3>
            <sm-list
              data-sm-test-id="day-one-activities"
              :draggable="true"
              :list="dayOne"
              group="colours"
            >
              <sm-list-item
                v-for="colour in dayOne"
                :key="colour.id"
                :label="colour.label"
              />
            </sm-list>
          </div>

          <div class="cm-flex-1 cm-min-w-248">
            <h3 class="sm-section-heading--large">{{ t('list.dayTwo.title') }}</h3>
            <sm-list
              data-sm-test-id="day-two-activities"
              :draggable="true"
              :list="dayTwo"
              group="colours"
            >
              <sm-list-item
                v-for="colour in dayTwo"
                :key="colour.id"
                :label="colour.label"
              />
            </sm-list>
          </div>
        </div>
      </sm-container>
      <sm-container :full-width="true">
        <sm-card
          :editing="true"
          class="cm-w-1/2"
        >
          <sm-card-content>
            <h4>{{ t('color-picker-theme-title') }}</h4>
            <p>{{ t('color-picker-theme-description') }}</p>
            <div class="cm-flex cm-flex-wrap cm-grid-responsive--gap-12">
              <div>
                <sm-color-picker
                  v-model="defaultColor"
                  :hex-color.sync="defaultColor"
                  :visible-color-picker.sync="displayPicker"
                  data-sm-test-id="color-picker-one"
                >
                  <template #input>
                    <span>
                      <sm-input
                        v-model="defaultColor"
                        label="Color-picker one"
                        :error-disabled="true"
                        :label-hidden="true"
                        @focus="displayPicker = true"
                      >
                        <template #suffix>
                          <span
                            class="cm-color-picker-input-suffix"
                            :style="{ backgroundColor : defaultColor, width: '40px', height: '40px' }"
                          />
                        </template>
                      </sm-input>
                    </span>
                  </template>
                </sm-color-picker>
              </div>
              <div>
                <sm-color-picker
                  v-model="defaultColorOne"
                  :hex-color.sync="defaultColorOne"
                  :visible-color-picker.sync="displayPickerOne"
                >
                  <template #input>
                    <span>
                      <sm-input
                        v-model="defaultColorOne"
                        label="Color-picker two"
                        :error-disabled="true"
                        :label-hidden="true"
                        @focus="displayPickerOne = true"
                      >
                        <template #suffix>
                          <span
                            class="cm-color-picker-input-suffix"
                            :style="{ backgroundColor : defaultColorOne, width: '40px', height: '40px' }"
                          />
                        </template>
                      </sm-input>
                    </span>
                  </template>
                </sm-color-picker>
              </div>
            </div>
          </sm-card-content>
        </sm-card>
      </sm-container>
    </sm-section>
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
