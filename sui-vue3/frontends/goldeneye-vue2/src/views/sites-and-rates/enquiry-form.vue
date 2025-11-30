<script setup lang="ts">
import { extend } from 'vee-validate'
import { computed, reactive, ref, watch } from 'vue'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.sites-and-rates.enquiry-form')

// #region - form one: personal details and booking details
interface MultiSelectType { open: () => void, close: () => void }

const formOneRef = ref()
const formOneSending = ref(false)

const formOne = reactive({
  to: '',
  name: '',
  address: '',
  facility: null,
  phone: null,
  selectType: null,
  selectPet: null,
  breakfast: false,
  lunch: false,
  dinner: false,
  dateOfBirth: null,
  duration: null,
  contactOptions: [],
  checkInTime: null,
  checkOutTime: null,
  services: [],
  amenities: [],
  meal: '',
})

const controls = ref<number | null>(0)
const countryCode = '+1'
const country = 'US'
const durationRangeRef = ref()
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
  formOne.services = confirmedSelection.value
}

const confirmSelection = (): void => {
  confirmedSelection.value = formOne.services
  serviceSelection.value?.close()
}

const cancelSelection = (): void => {
  resetSelection()
  serviceSelection.value?.close()
}

const isMealSelectionDisabled = computed(() => {
  return !formOne.breakfast && !formOne.lunch && !formOne.dinner
})

watch(isMealSelectionDisabled, (newValue) => {
  if (newValue) {
    formOne.meal = ''
  }
})

const sendFormOne = (e: unknown): void => {
  formOneSending.value = true

  console.info('sending form one v-model values', formOne)
  console.info('sending form one @submit payload values', e)

  setTimeout(() => {
    formOneSending.value = false
  }, 3000)
}

const resetFormOne = (): void => {
  // Resetting the form values
  formOne.to = ''
  formOne.name = ''
  formOne.address = ''
  formOne.facility = null
  formOne.phone = null
  formOne.selectType = null
  formOne.selectPet = null
  formOne.breakfast = false
  formOne.lunch = false
  formOne.dinner = false
  formOne.dateOfBirth = null
  formOne.duration = null
  formOne.contactOptions = []
  controls.value = null
  formOne.checkInTime = null
  formOne.checkOutTime = null
  formOne.services = []
  formOne.amenities = []
  formOne.meal = ''

  // Clearing the fields errors
  formOneRef.value.reset()
}

// Custom rule via https://vee-validate.logaretm.com/v3/guide/basics.html#adding-rules
// This is `defineRule` in vee-validate@4 (Vue3)
extend('customMaxValue', (value: number) => {
  if (value <= 99) {
    return true
  }

  return t('formOne.controls-error')
})
// #endregion - form one

// #region - form two: other details
const formTwoRef = ref()
const formTwoSending = ref(false)

const formTwo = reactive({
  referrals: [],
  terms: null,
})

const sendFormTwo = (): void => {
  formTwoSending.value = true

  console.info('sending form two', formTwo)

  setTimeout(() => {
    formTwoSending.value = false
  }, 3000)
}

const resetFormTwo = (): void => {
  // Resetting the form values
  formTwo.referrals = []
  formTwo.terms = null
  // Clearing the fields errors
  formTwoRef.value.reset()
}
// #endregion - form two
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />
      <sm-form
        ref="formOneRef"
        class="cm-max-w-lg"
        :disabled="formOneSending"
        @submit="sendFormOne"
        @reset="resetFormOne"
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
              v-model="formOne.dateOfBirth"
              name="date-of-birth"
              rules="required"
              suffix-icon="action-calendar"
              :help-text="t('formOne.date-of-birth-help-text')"
              :label="t('formOne.date-of-birth')"
              :model-config="{
                type: 'string',
                mask: 'YYYY-MM-DD',
              }"
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
              />
              <sm-radio
                v-model="formOne.facility"
                name="facility"
                :label="t('formOne.facilityTwo')"
                selected-value="Conference"
              />
            </sm-radio-group>
            <sm-date-picker
              ref="durationRangeRef"
              v-model="formOne.duration"
              rules="required"
              :columns="2"
              :start-date-placeholder="t('formOne.check-in-placeholder')"
              :end-date-placeholder="t('formOne.check-out-placeholder')"
              :label="t('formOne.duration') + ' - prop'"
              :is-range="true"
              :model-config="{
                type: 'string',
                mask: 'YYYY-MM-DD',
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
              v-model="formOne.checkInTime"
              name="check-in-time"
              :select-none="t('placeholder-text-time-picker')"
              :label="t('check-in-time-label')"
              from="00:00"
              to="23:00"
              :placeholder="t('placeholder-text-time-picker')"
              rules="required"
            />

            <sm-time-picker
              v-model="formOne.checkOutTime"
              name="check-out-time"
              :select-none="t('placeholder-text-time-picker')"
              :label="t('check-out-time-label')"
              from="00:00"
              to="23:00"
              :placeholder="t('placeholder-text-time-picker')"
              rules="required"
            />

            <sm-select
              v-model="formOne.selectType"
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
              v-model="formOne.selectPet"
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
              name="contact-options"
              rules="required"
              :label="t('formOne.contact-options')"
            >
              <sm-checkbox-button
                v-model="formOne.contactOptions"
                name="contact-options"
                selected-value="morning"
                :label="t('formOne.morning')"
              />
              <sm-checkbox-button
                v-model="formOne.contactOptions"
                name="contact-options"
                selected-value="afternoon"
                :label="t('formOne.afternoon')"
              />
              <sm-checkbox-button
                v-model="formOne.contactOptions"
                name="contact-options"
                selected-value="evening"
                :label="t('formOne.evening')"
              />
              <sm-checkbox-button
                v-model="formOne.contactOptions"
                name="contact-options"
                selected-value="anytime"
                :label="t('formOne.anytime')"
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
        ref="formTwoRef"
        class="cm-max-w-lg"
        :disabled="formTwoSending"
        @submit="sendFormTwo"
        @reset="resetFormTwo"
      >
        <template #default="{ invalid }">
          <sm-form-group legend="Other Details">
            <sm-checkbox-group
              name="referrals"
              :label="t('checkbox.label')"
              rules="required"
            >
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.google')"
                selected-value="google"
                name="referrals"
              />
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.facebook')"
                selected-value="facebook"
                name="referrals"
              />
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.newspaper')"
                selected-value="newspaper"
                name="referrals"
              />
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.social-media')"
                selected-value="social-media"
                name="referrals"
              />
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.tv')"
                selected-value="tv"
                name="referrals"
              />
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.radio')"
                selected-value="radio"
                name="referrals"
              />
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.word-of-mouth')"
                selected-value="word-of-mouth"
                name="referrals"
              />
              <sm-checkbox
                v-model="formTwo.referrals"
                :label="t('checkbox.options.other')"
                selected-value="other"
                name="referrals"
              />
            </sm-checkbox-group>
            <sm-checkbox
              v-model="formTwo.terms"
              name="terms-one"
              selected-value="true"
              :rules="{ required: { allowFalse: false } }"
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
    </sm-container>
  </sm-section>
</template>
