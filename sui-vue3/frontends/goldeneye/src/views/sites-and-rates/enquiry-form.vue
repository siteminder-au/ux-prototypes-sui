<script setup lang="ts">
import { defineRule } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { SmCheckbox, SmCheckboxButton, SmCheckboxGroup } from '@siteminder/sui-core/components/forms/sm-checkbox'
import { SmRadio, SmRadioGroup } from '@siteminder/sui-core/components/forms/sm-radio'
import { toastService } from '@siteminder/sui-core/services'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.sites-and-rates.enquiry-form')

// #region - form one: personal details and booking details
// Form one is the global `rules` way of validating forms, similar to Vue2
interface MultiSelectType { open: () => void, close: () => void }

const formOneSending = ref(false)

// NOTE: important that these keys match exactly to the `name` prop of the form inputs
const formOneInitialValue = {
  to: '',
  name: '',
  address: '',
  facility: null,
  phone: null,
  'select-type': null,
  'select-pet': null,
  breakfast: false,
  lunch: false,
  dinner: false,
  'date-of-birth': null,
  duration: null,
  'contact-options': [],
  'check-in-time': null,
  'check-out-time': null,
  services: [],
  amenities: [],
  meal: '',
  internet: false,
}

const formOne = ref(formOneInitialValue)

const controls = ref<number | null>(0)
const countryCode = '+1'
const country = 'US'
const today = new Date()

const serviceSelection = ref<MultiSelectType>()
const confirmedSelection = ref([])

const selectOption = ref([
  { label: 'Tent', code: 's0' },
  { label: 'Caravan', code: 's1' },
])

const selectPet = ref([
  { label: 'Yes', code: 's0' },
  { label: 'No', code: 's1' },
])

const serviceOptions = ref([
  { label: t('services.guided-tours'), code: 'm0' },
  { label: t('services.fishing-gear'), code: 'm1' },
  { label: t('services.kayak-rental'), code: 'm2' },
  { label: t('services.campfire-setup'), code: 'm3' },
  { label: t('services.wi-fi'), code: 'm4' },
  { label: t('services.laundry-service'), code: 'm5' },
  { label: t('services.equipment-rental'), code: 'm6' },
])

const amenitiesOptions = ref([
  {
    title: t('amenities.amenities.title'),
    libs: [
      { label: t('amenities.amenities.swimming-pool'), code: 'm0' },
      { label: t('amenities.amenities.gym'), code: 'm1' },
      { label: t('amenities.amenities.spa'), code: 'm2' },
      { label: t('amenities.amenities.parking'), code: 'm3' },
      { label: t('amenities.amenities.shuttle-service'), code: 'm4' },
    ],
  },
  {
    title: t('amenities.special-requests.title'),
    libs: [
      { label: t('amenities.special-requests.extra-pillows'), code: 'm5' },
      { label: t('amenities.special-requests.late-check-out'), code: 'm6' },
      { label: t('amenities.special-requests.early-check-in'), code: 'm7' },
      { label: t('amenities.special-requests.baby-crib'), code: 'm8' },
      { label: t('amenities.special-requests.allergy-free-room'), code: 'm9' },
      { label: t('amenities.special-requests.quiet-room'), code: 'm10' },
    ],
  },
  {
    title: t('amenities.events.title'),
    libs: [
      { label: t('amenities.events.yoga-class'), code: 'm11' },
      { label: t('amenities.events.wine-tasting'), code: 'm12' },
      { label: t('amenities.events.cooking-workshop'), code: 'm13' },
      { label: t('amenities.events.live-music'), code: 'm14' },
      { label: t('amenities.events.kids-activities'), code: 'm15' },
      { label: t('amenities.events.guided-hikes'), code: 'm16' },
    ],
  },
  {
    title: t('amenities.attractions.title'),
    libs: [
      { label: t('amenities.attractions.museum-tour'), code: 'm17' },
      { label: t('amenities.attractions.historical-sites'), code: 'm18' },
      { label: t('amenities.attractions.theme-park'), code: 'm19' },
      { label: t('amenities.attractions.nature-trails'), code: 'm20' },
      { label: t('amenities.attractions.shopping-district'), code: 'm21' },
      { label: t('amenities.attractions.local-markets'), code: 'm22' },
    ],
  },
])

const mealOptions = ref([
  {
    title: t('meal.vegetarian.title'),
    libs: [
      { label: t('meal.vegetarian.oriental-label'), code: 'm0', description: t('meal.vegetarian.oriental-description') },
      { label: t('meal.vegetarian.hindu-label'), code: 'm1', description: t('meal.vegetarian.hindu-description') },
      { label: t('meal.vegetarian.lacto-ovo-label'), code: 'm2', description: t('meal.vegetarian.lacto-ovo-description') },
      { label: t('meal.vegetarian.vegan-label'), code: 'm3', description: t('meal.vegetarian.vegan-description') },
    ],
  },
  {
    title: t('meal.religious.title'),
    libs: [
      { label: t('meal.religious.moslem-label'), code: 'm4', description: t('meal.religious.moslem-description') },
      { label: t('meal.religious.kosher-label'), code: 'm5', description: t('meal.religious.kosher-description') },
      { label: t('meal.religious.hindu-label'), code: 'm6', description: t('meal.religious.hindu-description') },
      { label: t('meal.religious.jain-label'), code: 'm7', description: t('meal.religious.jain-description') },
    ],
  },
  {
    title: t('meal.dietary.title'),
    libs: [
      { label: t('meal.dietary.low-salt-label'), code: 'm8', description: t('meal.dietary.low-salt-description') },
      { label: t('meal.dietary.gluten-intolerant-label'), code: 'm9', description: t('meal.dietary.gluten-intolerant-description') },
      { label: t('meal.dietary.low-lactose-label'), code: 'm10', description: t('meal.dietary.low-lactose-description') },
      { label: t('meal.dietary.low-calorie-label'), code: 'm11', description: t('meal.dietary.low-calorie-description') },
      { label: t('meal.dietary.low-fat-label'), code: 'm12', description: t('meal.dietary.low-fat-description') },
      { label: t('meal.dietary.diabetic-label'), code: 'm13', description: t('meal.dietary.diabetic-description') },
      { label: t('meal.dietary.bland-label'), code: 'm14', description: t('meal.dietary.bland-description') },
      { label: t('meal.dietary.fruit-platter-label'), code: 'm15', description: t('meal.dietary.fruit-platter-description') },
    ],
  },
  {
    title: t('meal.child.title'),
    libs: [
      { label: t('meal.child.baby-label'), code: 'm16', description: t('meal.child.baby-description') },
      { label: t('meal.child.child-label'), code: 'm17', description: t('meal.child.child-description') },
    ],
  },
  {
    title: t('meal.others.title'),
    libs: [
      { label: t('meal.others.pre-cut-label'), code: 'm18', description: t('meal.others.pre-cut-description') },
    ],
  },
])

const resetSelection = (): void => {
  formOne.value.services = confirmedSelection.value
}

const confirmSelection = (): void => {
  confirmedSelection.value = formOne.value.services
  serviceSelection.value?.close()
}

const cancelSelection = (): void => {
  resetSelection()
  serviceSelection.value?.close()
}

const isMealSelectionDisabled = computed(() => {
  return !formOne.value.breakfast && !formOne.value.lunch && !formOne.value.dinner
})

watch(isMealSelectionDisabled, (newValue) => {
  if (newValue) {
    formOne.value.meal = ''
  }
})

const sendFormOne = (e: unknown) : void => {
  formOneSending.value = true

  console.info('sending form one v-model values', formOne)
  console.info('sending form one @submit payload values', e)

  setTimeout(() => {
    formOneSending.value = false
  }, 3000)
}

// Custom rule via https://vee-validate.logaretm.com/v4/guide/global-validators/
// This is `extend` in vee-validate@3 (Vue2)
defineRule('customMaxValue', (value: number) => {
  if (value <= 99) {
    return true
  }

  return t('formOne.controls-error')
})

// #endregion - form one

// #region - form two: other details
// Form two is the new `validation-schema` way of validating forms
interface EnquiryForm {
  'referrals': string[]
  'terms-one': string
}

const referrals = ref([])
const terms = ref(null)
const formTwoSending = ref(false)

const formTwoInitialValue = {
  referrals: [],
  'terms-one': null,
}

const formTwoSchema = {
  referrals: (value?: string[]) => {
    if (value && value.length > 0) {
      return true
    }
    const error = t('checkbox.errorTwo')
    return error
  },
  'terms-one': (value?: string) => {
    if (value) {
      return true
    }
    const error = t('checkbox.errorTwo')
    return error
  },
}

const sendFormTwo = (data: EnquiryForm): void => {
  formTwoSending.value = true

  console.info('sending form two', data)

  setTimeout(() => {
    formTwoSending.value = false
  }, 3000)
}
// #endregion - form two

const copyUrl = ref('https://www.campminder.com')

const onCopyUrlClick = (): void => {
  toastService({
    type: 'success',
    message: t('copy-url.success-message'),
    miniInfo: true,
    showClose: true,
  })
}
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />
      <sm-form
        class="cm-max-w-lg"
        :disabled="formOneSending"
        :initial-values="formOneInitialValue"
        @submit="sendFormOne"
      >
        <template #default="{ invalid }">
          <sm-form-group :legend="t('formOne.personal-details-legend')">
            <sm-input
              v-model="formOne.name"
              type="text"
              :label="t('formOne.name')"
              rules="required"
              name="name"
            />
            <sm-input
              v-model="formOne.address"
              type="text"
              :label="t('formOne.address')"
              rules="required"
              name="address"
            />
            <sm-input
              v-model="formOne.to"
              type="email"
              :label="t('formOne.email')"
              rules="email"
              name="to"
            />
            <sm-input
              v-model.number="formOne.phone"
              type="number"
              :label="t('formOne.phone')"
              rules="required|integer|min_value:0"
              name="phone"
            >
              <template #prefix>
                <sm-input-prefix-content>{{ countryCode }}</sm-input-prefix-content>
              </template>
              <template #suffix>
                <sm-input-suffix-content>{{ country }}</sm-input-suffix-content>
              </template>
            </sm-input>

            <sm-date-picker
              v-model="formOne['date-of-birth']"
              name="date-of-birth"
              rules="required"
              suffix-icon="action-calendar"
              :help-text="t('formOne.date-of-birth-help-text')"
              :label="t('formOne.date-of-birth')"
            />
          </sm-form-group>

          <sm-form-group :legend="t('formOne.booking-details-legend')">
            <sm-input
              v-model="controls"
              :disable-increment="false"
              :disable-decrement="false"
              :label="t('formOne.controls')"
              name="controls"
              type="number"
              :controls="true"
              rules="min_value:1|customMaxValue:99"
            />

            <sm-radio-group
              v-model="formOne.facility"
              :label="t('formOne.facility')"
              rules="required"
              name="facility"
            >
              <sm-radio
                v-model="formOne.facility"
                name="facility"
                :label="t('formOne.facilityOne')"
                selected-value="ground"
                :error-disabled="true"
              />
              <sm-radio
                v-model="formOne.facility"
                name="facility"
                :label="t('formOne.facilityTwo')"
                selected-value="Conference"
                :error-disabled="true"
              />
            </sm-radio-group>

            <sm-date-picker
              v-model="formOne.duration"
              name="duration"
              rules="required"
              :columns="2"
              :start-date-placeholder="t('formOne.check-in-placeholder')"
              :end-date-placeholder="t('formOne.check-out-placeholder')"
              :label="t('formOne.duration') + ' - prop'"
              :model-modifiers="{
                range: true
              }"
              :min-date="today"
            >
              <template #label>{{ t('formOne.duration') }} </template>
              <template #action>
                <sm-tooltip
                  trigger="hover"
                  placement="right"
                  :close-on-click-outside="false"
                  :title="t('formOne.duration-tooltip')"
                >
                  <sm-icon
                    class="cm-disabled-dark"
                    name="utility-information-alt"
                  />
                </sm-tooltip>
              </template>
            </sm-date-picker>

            <sm-time-picker
              v-model="formOne['check-in-time']"
              name="check-in-time"
              :select-none="t('placeholder-text-time-picker')"
              :label="t('check-in-time-label')"
              from="00:00"
              to="23:00"
              :placeholder="t('placeholder-text-time-picker')"
              rules="required"
            />

            <sm-time-picker
              v-model="formOne['check-out-time']"
              name="check-out-time"
              :select-none="t('placeholder-text-time-picker')"
              from="00:00"
              to="23:00"
              :placeholder="t('placeholder-text-time-picker')"
              rules="required"
            >
              <template #label>
                {{ t('check-out-time-label') }}
              </template>
              <template #action>
                <sm-tooltip
                  trigger="hover"
                  placement="top"
                  :title="t('check-out-time-label')"
                >
                  <sm-icon name="utility-information-alt" />
                </sm-tooltip>
              </template>
              <template #prefix>
                <sm-select-prefix-content>
                  <sm-icon name="action-calendar" />
                </sm-select-prefix-content>
              </template>
              <template #suffix>
                <sm-select-suffix-content>
                  <sm-icon name="action-time" />
                </sm-select-suffix-content>
              </template>
            </sm-time-picker>

            <sm-select
              v-model="formOne['select-type']"
              name="camp-type-select"
              class="flex-1"
              :label="t('camp-type-select')"
              rules="required"
              :options="selectOption"
            >
              <template #prefix>
                <sm-select-prefix-content>
                  <sm-icon name="section-home" />
                </sm-select-prefix-content>
              </template>
            </sm-select>

            <sm-select
              v-model="formOne['select-pet']"
              name="camp-pet-select"
              class="flex-1"
              :label="t('camp-pet-select')"
              rules="required"
              :options="selectPet"
            >
              <template #suffix>
                <sm-select-suffix-content>
                  <sm-icon name="section-home" />
                </sm-select-suffix-content>
              </template>
            </sm-select>

            <sm-multi-select
              ref="serviceSelection"
              v-model="formOne.services"
              :label="t('formOne.services')"
              name="services"
              :placeholder="t('formOne.services-placeholder')"
              :multiple="true"
              :options="serviceOptions"
              :show-select-all-option="false"
              rules="required"
              :allow-empty="false"
              @close="resetSelection"
            >
              <template #footer>
                <sm-button
                  type="tertiary"
                  size="small"
                  @click="cancelSelection"
                >
                  {{ t('formOne.cancel') }}
                </sm-button>
                <sm-button
                  type="primary"
                  size="small"
                  @click="confirmSelection"
                >
                  {{ t('formOne.add') }}
                </sm-button>
              </template>
            </sm-multi-select>

            <sm-multi-select
              v-model="formOne.amenities"
              :label="t('formOne.amenities')"
              name="amenities"
              :placeholder="t('formOne.amenities-placeholder')"
              :multiple="true"
              :options="amenitiesOptions"
              :show-group-select="true"
            >
              <template #prefix>
                <span class="sm-multi-select-prefix-content">
                  <sm-icon name="amenities" />
                </span>
              </template>
            </sm-multi-select>

            <sm-switch-group :has-border="true">
              <sm-switch
                v-model="formOne.internet"
                name="internet"
                :label="t('formOne.internet')"
              />
            </sm-switch-group>
            <br>
            <sm-switch-group :label="t('formOne.switch')">
              <sm-switch
                v-model="formOne.breakfast"
                name="breakfast"
                :label="t('formOne.breakfast')"
              />
              <sm-switch
                v-model="formOne.lunch"
                name="lunch"
                :label="t('formOne.lunch')"
              />
              <sm-switch
                v-model="formOne.dinner"
                name="dinner"
                :label="t('formOne.dinner')"
              />
            </sm-switch-group>

            <sm-multi-select
              v-model="formOne.meal"
              :label="t('formOne.meal')"
              name="meal"
              :placeholder="t('formOne.meal-placeholder')"
              :filterable="false"
              :options="mealOptions"
              :show-group-select="true"
              :disabled="isMealSelectionDisabled"
              :truncate-option-description="true"
            >
              <template #suffix>
                <span class="sm-multi-select-suffix-content">
                  <sm-icon name="amenity-meal" />
                </span>
              </template>
            </sm-multi-select>

            <sm-checkbox-group
              v-model="formOne['contact-options']"
              name="contact-options"
              rules="required"
              :label="t('formOne.contact-options')"
            >
              <sm-checkbox-button
                v-model="formOne['contact-options']"
                name="contact-options"
                selected-value="morning"
                rules="required"
                :label="t('formOne.morning')"
                :error-disabled="true"
              />
              <sm-checkbox-button
                v-model="formOne['contact-options']"
                name="contact-options"
                selected-value="afternoon"
                rules="required"
                :label="t('formOne.afternoon')"
                :error-disabled="true"
              />
              <sm-checkbox-button
                v-model="formOne['contact-options']"
                name="contact-options"
                selected-value="evening"
                rules="required"
                :label="t('formOne.evening')"
                :error-disabled="true"
              />
              <sm-checkbox-button
                v-model="formOne['contact-options']"
                name="contact-options"
                selected-value="anytime"
                rules="required"
                :label="t('formOne.anytime')"
                :error-disabled="true"
              />
            </sm-checkbox-group>
            <br>
          </sm-form-group>

          <div class="text-right">
            <sm-button
              :disabled="formOneSending"
              native-type="reset"
              type="text"
            >
              {{ t('formOne.cancel') }}
            </sm-button>
            <sm-button
              :disabled="invalid"
              :loading="formOneSending"
              native-type="submit"
              type="primary"
            >
              {{ t('formOne.submit') }}
            </sm-button>
          </div>
        </template>
      </sm-form>
      <br>
      <br>
      <sm-form
        class="cm-max-w-lg cm-mb-32"
        :initial-values="formTwoInitialValue"
        :validation-schema="formTwoSchema"
        @submit="sendFormTwo"
      >
        <template #default="{ invalid }">
          <sm-form-group legend="Other Details">
            <sm-checkbox-group
              v-model="referrals"
              name="referrals"
              :label="t('checkbox.label')"
              rules="required"
            >
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.google')"
                selected-value="google"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.facebook')"
                selected-value="facebook"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.newspaper')"
                selected-value="newspaper"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.social-media')"
                selected-value="social-media"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.tv')"
                selected-value="tv"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.radio')"
                selected-value="radio"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.word-of-mouth')"
                selected-value="word-of-mouth"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
              <sm-checkbox
                v-model="referrals"
                :label="t('checkbox.options.other')"
                selected-value="other"
                name="referrals"
                :error-disabled="true"
                rules="required"
              />
            </sm-checkbox-group>
            <sm-checkbox
              v-model="terms"
              name="terms-one"
              selected-value="true"
              rules="required"
            >
              {{ t('checkbox.terms') }} <a href="#">{{ t('checkbox.terms-and-conditions') }}</a>
            </sm-checkbox>
          </sm-form-group>
          <div class="text-right">
            <sm-button
              :disabled="formTwoSending"
              native-type="reset"
              type="text"
            >
              {{ t('checkbox.cancel') }}
            </sm-button>
            <sm-button
              :disabled="invalid"
              :loading="formTwoSending"
              native-type="submit"
              type="primary"
            >
              {{ t('checkbox.submit') }}
            </sm-button>
          </div>
        </template>
      </sm-form>
      <sm-input
        v-model="copyUrl"
        name="copyUrl"
        type="url"
        suffix-width="70px"
        :disabled="true"
        :label="t('copy-url.input-label')"
      >
        <template #suffix>
          <sm-input-suffix-button @click="onCopyUrlClick">
            {{ t('copy-url.button-label') }}
            <sm-icon
              class="cm-ml-4"
              name="action-copy"
            />
          </sm-input-suffix-button>
        </template>
      </sm-input>
    </sm-container>
  </sm-section>
</template>
