<template>
  <div class="slide-wrapper" :class="{ 'full-width': fullWidthForm }">

    <!-- LEFT: Reference Images -->
    <div v-if="!fullWidthForm" class="slide-left">
      <div class="container-header">Before / Production</div>
      <div class="container-content">
        <img :src="rateRef1" alt="Room rate reference - production" style="width: 100%; display: block;" />
        <img :src="rateRef2" alt="Room rate reference 2 - production"
          style="width: 100%; display: block; margin-top: 1rem;" />
      </div>
    </div>

    <!-- RIGHT: Proposed Implementation -->
    <div class="slide-right">
      <div class="container-header">Proposed</div>

      <!-- Drawer Header -->
      <div class="sm-drawer__header">
        <div class="sm-drawer__header-section sm-drawer__header-section--title">
          <h2>Edit room rate</h2>
          <p class="drawer-page-subtitle">
            Advance purchase / Apartment
          </p>
        </div>
        <div class="sm-drawer__action-buttons">
          <div class="sm-drawer__header-section sm-drawer__header-section--actions">
            <SmButton type="tertiary" size="large" @click="handleCancel">
              Cancel
            </SmButton>
            <SmButton type="primary" size="large" native-type="submit" form="room-rate-form">
              Save
            </SmButton>
          </div>
        </div>
      </div>

      <div class="container-content">
        <SmForm id="room-rate-form" @submit="handleFormSubmit" @invalid-submit="handleInvalidSubmit">
          <div class="form-content-wrapper" :class="{ 'show-backgrounds': showContainerBackgrounds, 'show-markup': showMarkup }">
            <GridOverlay :show="showGridOverlay" />

            <!-- Error Summary -->
            <SmHelpCard v-if="hasErrors" type="warning">
              <template #header>
                Please check the following fields for errors.
              </template>
              <template #body>
                <ul class="error-list">
                  <li v-for="field in errorFieldsList" :key="field.name">
                    <a :href="`#${field.id}`" class="error-link">{{ field.label }}</a>
                  </li>
                </ul>
              </template>
            </SmHelpCard>

            <!-- 1. GENERAL INFORMATION -->
            <SmFormGroup id="general-information">
              <h2 class="form-heading-1">General Information</h2>

              <SmInput id="roomType" v-model="roomType" label="Room type" name="roomType" disabled />

              <SmInput id="description" v-model="description" label="Description" name="description" type="textarea"
                :rows="3" :maxlength="250" :show-word-limit="true" />
            </SmFormGroup>

            <!-- 2. OCCUPANCY -->
            <SmFormGroup id="occupancy">
              <h2 class="form-heading-1">Occupancy</h2>

              <div class="checkbox-with-tooltip">
                <SmCheckbox id="occupancyBasedPricing" v-model="occupancyBasedPricing" name="occupancyBasedPricing"
                  label="Enable Occupancy-Based Pricing" />
                <SmTooltip title="Enable Occupancy Based Pricing (OBP) for this Room Rate and any derived Room Rates"
                  trigger="hover" placement="right">
                  <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                </SmTooltip>
              </div>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="includedOccupancy" v-model="includedOccupancy" label="Included occupancy"
                    name="includedOccupancy" type="number" :min="1" :mandatory="true" :rules="validateRequired" />
                </div>
                <div class="form-col">
                  <SmInput id="maximumOccupancy" v-model="maximumOccupancy" label="Maximum occupancy"
                    name="maximumOccupancy" type="number" :min="1" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="defaultMinStay" v-model="defaultMinStay" label="Default minimum stay"
                    name="defaultMinStay" disabled>
                    <template #suffix>
                      <SmButton type="tertiary" size="large" disabled>
                        <SmIcon name="action-lock" />
                      </SmButton>
                    </template>
                  </SmInput>
                </div>
                <div class="form-col">
                  <SmInput id="defaultMaxStay" v-model="defaultMaxStay" label="Default maximum stay"
                    name="defaultMaxStay" disabled>
                    <template #suffix>
                      <SmButton type="tertiary" size="large" disabled>
                        <SmIcon name="action-lock" />
                      </SmButton>
                    </template>
                  </SmInput>
                </div>
              </div>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="releasePeriod" v-model="releasePeriod" label="Release period" name="releasePeriod"
                    disabled>
                    <template #suffix>
                      <SmButton type="tertiary" size="large" disabled>
                        <SmIcon name="action-lock" />
                      </SmButton>
                    </template>
                  </SmInput>
                </div>
              </div>

              <SmCheckbox id="autoStopSell" v-model="autoStopSell" name="autoStopSell"
                label="Enable default stop sell" />

              <SmRadioGroup label="Availability" v-model="availability" name="availability">
                <SmRadio v-model="availability" name="availability" selected-value="linked"
                  label="Linked to selected room type" :error-disabled="true" />
                <SmRadio v-model="availability" name="availability" selected-value="managed"
                  label="Managed independently" :error-disabled="true" />
              </SmRadioGroup>
            </SmFormGroup>

            <!-- 3. INCLUSIONS -->
            <SmFormGroup id="inclusions">
              <h2 class="form-heading-1">Inclusions</h2>

              <div class="inclusions-section">
                <label class="sm-field-label">Supported inclusions</label>

                <div class="inclusion-item">
                  <SmIcon name="action-lock" class="inclusion-lock-icon" />
                  <SmCheckbox id="breakfast" v-model="breakfast" name="breakfast" label="Breakfast" disabled />
                </div>

                <div class="inclusion-item">
                  <SmIcon name="action-lock" class="inclusion-lock-icon" />
                  <SmCheckbox id="lunch" v-model="lunch" name="lunch" label="Lunch" disabled />
                </div>

                <div class="inclusion-item">
                  <SmIcon name="action-lock" class="inclusion-lock-icon" />
                  <SmCheckbox id="dinner" v-model="dinner" name="dinner" label="Dinner" disabled />
                </div>
              </div>
            </SmFormGroup>

            <!-- 4. PRICING DETAILS -->
            <SmFormGroup id="pricing-details">
              <h2 class="form-heading-1">Pricing Details</h2>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="minimumRate" v-model="minimumRate" label="Minimum rate" name="minimumRate" disabled>
                    <template #prefix>
                      <SmInputPrefixContent>AUD</SmInputPrefixContent>
                    </template>
                    <template #suffix>
                      <SmButton type="tertiary" size="large" disabled>
                        <SmIcon name="action-lock" />
                      </SmButton>
                    </template>
                    <template #action>
                      <SmTooltip
                        title="Rates must be managed at channel room rate level. Contact support if you want to change this configuration."
                        trigger="hover" placement="right">
                        <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                      </SmTooltip>
                    </template>
                  </SmInput>
                </div>
                <div class="form-col">
                  <SmInput id="fullRate" v-model="fullRate" label="Full rate" name="fullRate" type="number" :min="0"
                    placeholder="100" :mandatory="true" :rules="validateRequired">
                    <template #prefix>
                      <SmInputPrefixContent>AUD</SmInputPrefixContent>
                    </template>
                  </SmInput>
                </div>
              </div>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="extraAdultRate" v-model="extraAdultRate" label="Extra adult rate" name="extraAdultRate"
                    type="number" :min="0" placeholder="10" :mandatory="true" :rules="validateRequired">
                    <template #prefix>
                      <SmInputPrefixContent>AUD</SmInputPrefixContent>
                    </template>
                  </SmInput>
                </div>
                <div class="form-col">
                  <SmInput id="extraChildRate" v-model="extraChildRate" label="Extra child rate" name="extraChildRate"
                    type="number" :min="0" placeholder="10" :mandatory="true" :rules="validateRequired">
                    <template #prefix>
                      <SmInputPrefixContent>AUD</SmInputPrefixContent>
                    </template>
                  </SmInput>
                </div>
              </div>

              <SmCheckbox id="singleGuestDiscount" v-model="singleGuestDiscount" name="singleGuestDiscount"
                label="Enable single guest discount" />
            </SmFormGroup>

          </div>
        </SmForm>
      </div>
    </div>

    <!-- Settings Panel -->
    <PrototypeSettings>
      <DisplaySettings />
    </PrototypeSettings>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PrototypeSettings from '@/shared/components/PrototypeSettings.vue'
import GridOverlay from '@/shared/components/GridOverlay.vue'
import DisplaySettings from '@/shared/components/DisplaySettings.vue'
import { useDisplaySettings } from '@/shared/composables/useDisplaySettings.js'

// Import reference images
import rateRef1 from '/images/dynamic-form/rate-1.png'
import rateRef2 from '/images/dynamic-form/rate-plan-2.png'

const { showGridOverlay, showContainerBackgrounds, fullWidthForm, showMarkup } = useDisplaySettings()

// Form data - General Information
const roomType = ref('Apartment')
const description = ref('')

// Form data - Occupancy
const occupancyBasedPricing = ref(false)
const includedOccupancy = ref(2)
const maximumOccupancy = ref(2)
const defaultMinStay = ref('Min. allowed booking nights')
const defaultMaxStay = ref('Max. allowed booking nights')
const releasePeriod = ref('Release period')
const autoStopSell = ref(false)
const availability = ref('linked')

// Form data - Inclusions
const breakfast = ref(false)
const lunch = ref(false)
const dinner = ref(false)

// Form data - Pricing Details
const minimumRate = ref('AUD')
const fullRate = ref(null)
const extraAdultRate = ref(null)
const extraChildRate = ref(null)
const singleGuestDiscount = ref(false)

// Validation function
const validateRequired = (value) => {
  if (!value && value !== 0) {
    return 'This field is required'
  }
  return true
}

// Error handling
const formErrors = ref({})

const errorFieldsList = computed(() => {
  const fieldLabels = {
    includedOccupancy: 'Included occupancy',
    fullRate: 'Full rate',
    extraAdultRate: 'Extra adult rate',
    extraChildRate: 'Extra child rate'
  }
  const fieldIds = {
    includedOccupancy: 'includedOccupancy',
    fullRate: 'fullRate',
    extraAdultRate: 'extraAdultRate',
    extraChildRate: 'extraChildRate'
  }
  return Object.keys(formErrors.value).map(fieldName => ({
    name: fieldName,
    id: fieldIds[fieldName] || fieldName,
    label: fieldLabels[fieldName] || fieldName,
    error: formErrors.value[fieldName]
  }))
})

const hasErrors = computed(() => Object.keys(formErrors.value).length > 0)

// Form handlers
const handleFormSubmit = (values) => {
  console.log('Form submitted:', values)
  formErrors.value = {}
}

const handleInvalidSubmit = (errors) => {
  console.log('Form validation failed:', errors)
  formErrors.value = errors?.errors || {}
}

const handleCancel = () => {
  console.log('Cancel clicked')
  // Reset form or navigate away
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
