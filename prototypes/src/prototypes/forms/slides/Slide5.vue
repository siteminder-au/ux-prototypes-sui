<template>
  <div class="slide-wrapper" :class="{ 'full-width': fullWidthForm }">

    <!-- LEFT: Reference/Before -->
    <div v-if="!fullWidthForm" class="slide-left">
      <div class="container-header">Before / Production</div>
      <div class="container-content">
        <img :src="readModeRef2" alt="Property settings 2 read mode - production" style="width: 100%; display: block;" />
        <img :src="editModeRef2" alt="Property settings 2 edit mode - production" style="width: 100%; display: block; margin-top: 1rem;" />
        <img :src="readModeRef3" alt="Property settings 3 read mode - production" style="width: 100%; display: block; margin-top: 1rem;" />
        <img :src="editModeRef3" alt="Property settings 3 edit mode - production" style="width: 100%; display: block; margin-top: 1rem;" />
        <img :src="readModeRef" alt="Property settings read mode - production" style="width: 100%; display: block; margin-top: 1rem;" />
        <img :src="editModeRef" alt="Property settings edit mode - production" style="width: 100%; display: block; margin-top: 1rem;" />
      </div>
    </div>

    <!-- RIGHT: Proposed Implementation -->
    <div class="slide-right">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <div class="form-content-wrapper" :class="{ 'show-backgrounds': showContainerBackgrounds, 'show-markup': showMarkup }">

                <!-- Currency Card -->
                <SmCard class="settings-card">
                  <SmCardActions>
                    <SmButton
                      type="text"
                      shape="square"
                      @click="toggleEdit('currency')"
                      :aria-label="editingCurrency ? 'Cancel editing' : 'Edit currency'"
                    >
                      <SmIcon :name="editingCurrency ? 'action-cross' : 'action-edit'" />
                    </SmButton>
                  </SmCardActions>

                  <SmCardContent>
                    <h4>Currency</h4>

                    <!-- EDIT MODE -->
                    <SmForm v-if="editingCurrency" @submit="saveEdit('currency')">
                      <GridOverlay :show="showGridOverlay" />
                      <SmFormGroup>
                        <SmSelect
                          id="baseCurrency"
                          v-model="baseCurrency"
                          label="Base currency"
                          name="baseCurrency"
                          :options="currencyOptions"
                          placeholder="Select currency"
                          disabled
                        />

                        <SmCheckbox
                          v-model="enableCurrencyConversion"
                          id="enableCurrencyConversion"
                          name="enableCurrencyConversion"
                          label="Enable currency conversion"
                        />
                      </SmFormGroup>

                      <div class="edit-actions">
                        <div class="text-right">
                          <SmButton type="tertiary" @click="cancelEdit('currency')">
                            Cancel
                          </SmButton>
                          <SmButton type="primary" native-type="submit">
                            Save
                          </SmButton>
                        </div>
                      </div>
                    </SmForm>

                    <!-- READ MODE -->
                    <div v-else class="read-fields">
                      <div class="read-field">
                        <span class="read-field-label">Base currency</span>
                        <span class="read-field-value">{{ getCurrencyLabel(baseCurrency) }}</span>
                      </div>

                      <div class="read-field">
                        <span class="read-field-label">Currency conversion</span>
                        <span class="read-field-value">{{ enableCurrencyConversion ? 'Enabled' : 'Disabled' }}</span>
                      </div>
                    </div>
                  </SmCardContent>
                </SmCard>

                <!-- Inventory Card -->
                <SmCard class="settings-card">
                  <SmCardActions>
                    <SmButton
                      type="text"
                      shape="square"
                      @click="toggleEdit('inventory')"
                      :aria-label="editingInventory ? 'Cancel editing' : 'Edit inventory'"
                    >
                      <SmIcon :name="editingInventory ? 'action-cross' : 'action-edit'" />
                    </SmButton>
                  </SmCardActions>

                  <SmCardContent>
                    <h4>Inventory</h4>

                    <!-- EDIT MODE -->
                    <SmForm
                      v-if="editingInventory"
                      @submit="saveEdit('inventory')"
                      @invalid-submit="handleInventoryInvalidSubmit"
                    >
                      <GridOverlay :show="showGridOverlay" />
                      <SmFormGroup>
                        <div v-for="(rate, index) in minimumRates" :key="rate.id" class="minimum-rate-row">
                          <div class="form-row">
                            <div class="form-col col-span-2">
                              <SmInput
                                :id="`minimumRate-${rate.id}`"
                                v-model="rate.value"
                                :name="`minimumRate-${rate.id}`"
                                type="number"
                                placeholder="0"
                                :class="{ 'has-interactive-prefix': index > 0 }"
                                :rules="validateUniqueCurrency(rate.id)"
                              >
                                <template #label>
                                  <div class="label-with-delete">
                                    <span>Minimum rate</span>
                                    <SmButton
                                      v-if="index > 0"
                                      type="text-warning"
                                      size="small"
                                      @click="deleteMinimumRate(rate.id)"
                                      :aria-label="`Delete minimum rate ${index + 1}`"
                                    >
                                      Delete
                                    </SmButton>
                                  </div>
                                </template>

                                <!-- First input: static prefix -->
                                <template v-if="index === 0" #prefix>
                                  <SmInputPrefixContent>AUD</SmInputPrefixContent>
                                </template>

                                <!-- Additional inputs: interactive prefix -->
                                <template v-else #prefix>
                                  <SmSelect
                                    v-model:selection="rate.currency"
                                    :name="`currency-${rate.id}`"
                                    :options="currencyCodeOptions"
                                    :filterable="false"
                                  />
                                </template>
                              </SmInput>
                            </div>
                          </div>
                        </div>

                        <SmButton
                          type="text"
                          size="large"
                          @click="addMinimumRate"
                          :disabled="minimumRates.length >= 5"
                          class="add-minimum-rate-btn"
                        >
                          <SmIcon name="controls-add" />
                          Add minimum rate
                        </SmButton>

                        <SmSelect
                          id="updatePeriod"
                          v-model="updatePeriod"
                          name="updatePeriod"
                          :options="updatePeriodOptions"
                          placeholder="Select update period"
                        >
                          <template #label>
                            Update period
                            <SmTooltip
                              title="Set the maximum number of days that updates are sent to your connected channels. The number of days each channel supports can be found in the channels section."
                              trigger="hover"
                              placement="right"
                            >
                              <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                            </SmTooltip>
                          </template>
                        </SmSelect>

                        <SmSelect
                          id="weekendStartsOn"
                          v-model="weekendStartsOn"
                          label="Weekend starts on"
                          name="weekendStartsOn"
                          :options="weekendStartsOnOptions"
                          placeholder="Select day"
                        />

                        <div class="checkbox-with-tooltip">
                          <SmCheckbox
                            v-model="enableAutoReplenishment"
                            id="enableAutoReplenishment"
                            name="enableAutoReplenishment"
                            label="Enable Auto-replenishment"
                          />
                          <SmTooltip
                            title="Enabling this functionality will ensure that your room availability will be replenished in your inventory automatically whenever a reservation has been cancelled or modified."
                            trigger="hover"
                            placement="right"
                          >
                            <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                          </SmTooltip>
                        </div>

                        <SmRadioGroup
                          v-if="enableAutoReplenishment"
                          label="Auto replenishment rules"
                          v-model="autoReplenishmentMode"
                          name="autoReplenishmentMode"
                        >
                          <SmRadio
                            v-model="autoReplenishmentMode"
                            name="autoReplenishmentMode"
                            selected-value="always"
                            label="Always"
                            :error-disabled="true"
                          />
                          <SmRadio
                            v-model="autoReplenishmentMode"
                            name="autoReplenishmentMode"
                            selected-value="conditional"
                            label="Only if the availability is 1 or more"
                            :error-disabled="true"
                          />
                        </SmRadioGroup>
                      </SmFormGroup>

                      <div class="edit-actions">
                        <div class="text-right">
                          <SmButton type="tertiary" @click="cancelEdit('inventory')">
                            Cancel
                          </SmButton>
                          <SmButton type="primary" native-type="submit">
                            Save
                          </SmButton>
                        </div>
                      </div>
                    </SmForm>

                    <!-- READ MODE -->
                    <div v-else class="read-fields">
                      <div class="read-field">
                        <span class="read-field-label">Minimum rate{{ minimumRates.length > 1 ? 's' : '' }}</span>
                        <span class="read-field-value">
                          <span v-for="(rate, index) in minimumRates" :key="rate.id">
                            {{ rate.value }} {{ rate.currency }}<span v-if="index < minimumRates.length - 1">, </span>
                          </span>
                        </span>
                      </div>

                      <div class="read-field">
                        <span class="read-field-label">Update period</span>
                        <span class="read-field-value">{{ getUpdatePeriodLabel(updatePeriod) }}</span>
                      </div>

                      <div class="read-field">
                        <span class="read-field-label">Weekend starts on</span>
                        <span class="read-field-value">{{ getWeekendStartLabel(weekendStartsOn) }}</span>
                      </div>

                      <div class="read-field">
                        <span class="read-field-label">Auto-replenishment</span>
                        <span class="read-field-value">{{ enableAutoReplenishment ? 'Enabled' : 'Disabled' }}</span>
                      </div>
                    </div>
                  </SmCardContent>
                </SmCard>

                <!-- Language and Region Card -->
                <SmCard class="settings-card">
                  <SmCardActions>
                    <SmButton
                      type="text"
                      shape="square"
                      @click="toggleEdit('languageRegion')"
                      :aria-label="editingLanguageRegion ? 'Cancel editing' : 'Edit language and region'"
                    >
                      <SmIcon :name="editingLanguageRegion ? 'action-cross' : 'action-edit'" />
                    </SmButton>
                  </SmCardActions>

                  <SmCardContent>
                    <h4>Language and region</h4>

                    <!-- EDIT MODE -->
                    <SmForm v-if="editingLanguageRegion" @submit="saveEdit('languageRegion')"
                      @invalid-submit="handleLanguageRegionInvalidSubmit">
                      <GridOverlay :show="showGridOverlay" />

                      <!-- Error Summary -->
                      <SmHelpCard v-if="languageRegionHasErrors" type="warning">
                        <template #header>Please check the following fields for errors.</template>
                        <template #body>
                          <ul class="error-list">
                            <li v-for="field in languageRegionErrorFieldsList" :key="field.name">
                              <a :href="`#${field.id}`" class="error-link">{{ field.label }}</a>
                            </li>
                          </ul>
                        </template>
                      </SmHelpCard>

                      <SmFormGroup>
                        <SmSelect
                          id="baseLanguage"
                          v-model="baseLanguage"
                          label="Base language"
                          name="baseLanguage"
                          :options="languageOptions"
                          placeholder="Select language"
                          :mandatory="true"
                        />

                        <SmRadioGroup
                          label="Units of measurement"
                          v-model="unitsOfMeasurement"
                          name="unitsOfMeasurement"
                        >
                          <SmRadio
                            v-model="unitsOfMeasurement"
                            name="unitsOfMeasurement"
                            selected-value="metric"
                            label="Metric"
                            :error-disabled="true"
                          />
                          <SmRadio
                            v-model="unitsOfMeasurement"
                            name="unitsOfMeasurement"
                            selected-value="imperial"
                            label="Imperial"
                            :error-disabled="true"
                          />
                        </SmRadioGroup>

                        <SmSelect
                          id="timeZone"
                          v-model="timeZone"
                          label="Time zone"
                          name="timeZone"
                          :options="timeZoneOptions"
                          placeholder="Select time zone"
                        />
                      </SmFormGroup>

                      <div class="edit-actions">
                        <div class="text-right">
                          <SmButton type="tertiary" @click="cancelEdit('languageRegion')">
                            Cancel
                          </SmButton>
                          <SmButton type="primary" native-type="submit">
                            Save
                          </SmButton>
                        </div>
                      </div>
                    </SmForm>

                    <!-- READ MODE -->
                    <div v-else class="read-fields">
                      <div class="read-field">
                        <span class="read-field-label">Base language</span>
                        <span class="read-field-value">{{ getLanguageLabel(baseLanguage) }}</span>
                      </div>

                      <div class="read-field">
                        <span class="read-field-label">Units of measurement</span>
                        <span class="read-field-value">{{ unitsOfMeasurement === 'metric' ? 'Metric' : 'Imperial' }}</span>
                      </div>

                      <div class="read-field">
                        <span class="read-field-label">Time zone</span>
                        <span class="read-field-value">{{ getTimeZoneLabel(timeZone) }}</span>
                      </div>
                    </div>
                  </SmCardContent>
                </SmCard>

        </div>
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
import readModeRef from '/images/dynamic-form/property-settings/propery-settings-1.png'
import editModeRef from '/images/dynamic-form/property-settings/propery-settings-2.png'
import readModeRef2 from '/images/dynamic-form/property-settings/propery-settings-3.png'
import editModeRef2 from '/images/dynamic-form/property-settings/propery-settings-4.png'
import readModeRef3 from '/images/dynamic-form/property-settings/propery-settings-5.png'
import editModeRef3 from '/images/dynamic-form/property-settings/propery-settings-6.png'

const { showGridOverlay, showContainerBackgrounds, fullWidthForm, showMarkup } = useDisplaySettings()

// Edit state tracking
const editingCurrency = ref(false)
const editingInventory = ref(false)
const editingLanguageRegion = ref(false)

// Form data - Currency
const baseCurrency = ref('AUD')
const enableCurrencyConversion = ref(false)

// Form data - Inventory
const minimumRate = ref('23')
const minimumRates = ref([
  { id: 1, value: '23', currency: 'AUD' }
])
const updatePeriod = ref('525')
const weekendStartsOn = ref('saturday')
const enableAutoReplenishment = ref(true)
const autoReplenishmentMode = ref('always')

// Form data - Language and Region
const baseLanguage = ref('en')
const unitsOfMeasurement = ref('metric')
const timeZone = ref('Australia/Sydney')

// Backup for cancel functionality
let baseCurrencyBackup = null
let enableCurrencyConversionBackup = null
let minimumRateBackup = null
let minimumRatesBackup = null
let updatePeriodBackup = null
let weekendStartsOnBackup = null
let enableAutoReplenishmentBackup = null
let autoReplenishmentModeBackup = null
let baseLanguageBackup = null
let unitsBackup = null
let timeZoneBackup = null

// Language options
const languageOptions = [
  { label: 'English', code: 'en' },
  { label: 'Thai', code: 'th' },
  { label: 'Japanese', code: 'ja' },
  { label: 'Chinese (Simplified)', code: 'zh-CN' },
  { label: 'French', code: 'fr' },
  { label: 'German', code: 'de' },
  { label: 'Spanish', code: 'es' }
]

// Time zone options
const timeZoneOptions = [
  { label: 'GMT+11:00 Eastern Australia Time (Australia/Sydney)', code: 'Australia/Sydney' },
  { label: 'GMT+10:00 Australian Eastern Standard Time (Australia/Brisbane)', code: 'Australia/Brisbane' },
  { label: 'GMT+08:00 Australian Western Standard Time (Australia/Perth)', code: 'Australia/Perth' },
  { label: 'GMT+09:30 Australian Central Standard Time (Australia/Adelaide)', code: 'Australia/Adelaide' },
  { label: 'GMT+00:00 Greenwich Mean Time (Europe/London)', code: 'Europe/London' },
  { label: 'GMT-05:00 Eastern Standard Time (America/New_York)', code: 'America/New_York' },
  { label: 'GMT-08:00 Pacific Standard Time (America/Los_Angeles)', code: 'America/Los_Angeles' }
]

// Currency options
const currencyOptions = [
  { label: 'AUD - Australian Dollar', code: 'AUD' },
  { label: 'USD - US Dollar', code: 'USD' },
  { label: 'EUR - Euro', code: 'EUR' },
  { label: 'GBP - British Pound', code: 'GBP' },
  { label: 'JPY - Japanese Yen', code: 'JPY' },
  { label: 'CAD - Canadian Dollar', code: 'CAD' }
]

// Currency code options for prefix select
const currencyCodeOptions = [
  { label: 'AUD', code: 'AUD' },
  { label: 'USD', code: 'USD' },
  { label: 'EUR', code: 'EUR' },
  { label: 'GBP', code: 'GBP' },
  { label: 'JPY', code: 'JPY' },
  { label: 'CAD', code: 'CAD' }
]

// Update period options
const updatePeriodOptions = [
  { label: '400 days', code: '400' },
  { label: '425 days', code: '425' },
  { label: '450 days', code: '450' },
  { label: '475 days', code: '475' },
  { label: '500 days', code: '500' },
  { label: '525 days', code: '525' }
]

// Weekend starts on options
const weekendStartsOnOptions = [
  { label: 'Monday', code: 'monday' },
  { label: 'Tuesday', code: 'tuesday' },
  { label: 'Wednesday', code: 'wednesday' },
  { label: 'Thursday', code: 'thursday' },
  { label: 'Friday', code: 'friday' },
  { label: 'Saturday', code: 'saturday' },
  { label: 'Sunday', code: 'sunday' }
]

// Helper functions
const getLanguageLabel = (value) => {
  return languageOptions.find(opt => opt.code === value)?.label || value
}

const getTimeZoneLabel = (value) => {
  return timeZoneOptions.find(opt => opt.code === value)?.label || value
}

const getCurrencyLabel = (value) => {
  return currencyOptions.find(opt => opt.code === value)?.label || value
}

const getWeekendStartLabel = (value) => {
  const days = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  }
  return days[value] || value
}

const getUpdatePeriodLabel = (value) => {
  return updatePeriodOptions.find(opt => opt.code === value)?.label || value
}

// Validation error handling for Language and Region card
const languageRegionFormErrors = ref({})

const languageRegionErrorFieldsList = computed(() => {
  const fieldLabels = {
    baseLanguage: 'Base language'
  }
  const fieldIds = {
    baseLanguage: 'baseLanguage'
  }
  return Object.keys(languageRegionFormErrors.value).map(fieldName => ({
    name: fieldName,
    id: fieldIds[fieldName] || fieldName,
    label: fieldLabels[fieldName] || fieldName,
    error: languageRegionFormErrors.value[fieldName]
  }))
})

const languageRegionHasErrors = computed(() => Object.keys(languageRegionFormErrors.value).length > 0)

const handleLanguageRegionInvalidSubmit = (errors) => {
  console.log('Language and region validation failed:', errors)
  languageRegionFormErrors.value = errors?.errors || {}
}

// Custom validation rule for checking duplicate currencies
const validateUniqueCurrency = (rateId) => {
  return (value) => {
    const rate = minimumRates.value.find(r => r.id === rateId)
    if (!rate) return true

    const duplicates = minimumRates.value.filter(r => r.currency === rate.currency)
    if (duplicates.length > 1) {
      return 'Only one minimum rate can be set per currency'
    }
    return true
  }
}

const handleInventoryInvalidSubmit = (errors) => {
  console.log('Inventory validation failed:', errors)
}

// Add minimum rate handler (max 5 rates)
const addMinimumRate = () => {
  if (minimumRates.value.length >= 5) {
    return
  }
  const newId = Math.max(...minimumRates.value.map(r => r.id)) + 1
  minimumRates.value.push({
    id: newId,
    value: '',
    currency: 'AUD'
  })
}

// Delete minimum rate handler
const deleteMinimumRate = (id) => {
  minimumRates.value = minimumRates.value.filter(rate => rate.id !== id)
}

// Edit mode handlers
const toggleEdit = (section) => {
  if (section === 'currency') {
    if (!editingCurrency.value) {
      // Entering edit mode - backup current values
      baseCurrencyBackup = baseCurrency.value
      enableCurrencyConversionBackup = enableCurrencyConversion.value
    }
    editingCurrency.value = !editingCurrency.value
  } else if (section === 'inventory') {
    if (!editingInventory.value) {
      // Entering edit mode - backup current values
      minimumRateBackup = minimumRate.value
      minimumRatesBackup = JSON.parse(JSON.stringify(minimumRates.value))
      updatePeriodBackup = updatePeriod.value
      weekendStartsOnBackup = weekendStartsOn.value
      enableAutoReplenishmentBackup = enableAutoReplenishment.value
      autoReplenishmentModeBackup = autoReplenishmentMode.value
    }
    editingInventory.value = !editingInventory.value
  } else if (section === 'languageRegion') {
    if (!editingLanguageRegion.value) {
      // Entering edit mode - backup current values
      baseLanguageBackup = baseLanguage.value
      unitsBackup = unitsOfMeasurement.value
      timeZoneBackup = timeZone.value
    }
    editingLanguageRegion.value = !editingLanguageRegion.value
  }
}

const cancelEdit = (section) => {
  if (section === 'currency') {
    // Restore backup values
    baseCurrency.value = baseCurrencyBackup
    enableCurrencyConversion.value = enableCurrencyConversionBackup
    editingCurrency.value = false
    baseCurrencyBackup = null
    enableCurrencyConversionBackup = null
  } else if (section === 'inventory') {
    // Restore backup values
    minimumRate.value = minimumRateBackup
    minimumRates.value = minimumRatesBackup
    updatePeriod.value = updatePeriodBackup
    weekendStartsOn.value = weekendStartsOnBackup
    enableAutoReplenishment.value = enableAutoReplenishmentBackup
    autoReplenishmentMode.value = autoReplenishmentModeBackup
    editingInventory.value = false
    minimumRateBackup = null
    minimumRatesBackup = null
    updatePeriodBackup = null
    weekendStartsOnBackup = null
    enableAutoReplenishmentBackup = null
    autoReplenishmentModeBackup = null
  } else if (section === 'languageRegion') {
    // Restore backup values
    baseLanguage.value = baseLanguageBackup
    unitsOfMeasurement.value = unitsBackup
    timeZone.value = timeZoneBackup
    editingLanguageRegion.value = false
    baseLanguageBackup = null
    unitsBackup = null
    timeZoneBackup = null
    languageRegionFormErrors.value = {}
  }
}

const saveEdit = (section) => {
  if (section === 'currency') {
    // In a real app, this would save to backend
    console.log('Saving currency:', {
      baseCurrency: baseCurrency.value,
      enableCurrencyConversion: enableCurrencyConversion.value
    })
    editingCurrency.value = false
    baseCurrencyBackup = null
    enableCurrencyConversionBackup = null
  } else if (section === 'inventory') {
    // In a real app, this would save to backend
    // Note: Validation for duplicate currencies is handled by vee-validate rules
    console.log('Saving inventory:', {
      minimumRate: minimumRate.value,
      minimumRates: minimumRates.value,
      updatePeriod: updatePeriod.value,
      weekendStartsOn: weekendStartsOn.value,
      enableAutoReplenishment: enableAutoReplenishment.value,
      autoReplenishmentMode: autoReplenishmentMode.value
    })
    editingInventory.value = false
    minimumRateBackup = null
    minimumRatesBackup = null
    updatePeriodBackup = null
    weekendStartsOnBackup = null
    enableAutoReplenishmentBackup = null
    autoReplenishmentModeBackup = null
  } else if (section === 'languageRegion') {
    // In a real app, this would save to backend
    console.log('Saving language and region:', {
      baseLanguage: baseLanguage.value,
      unitsOfMeasurement: unitsOfMeasurement.value,
      timeZone: timeZone.value
    })
    editingLanguageRegion.value = false
    baseLanguageBackup = null
    unitsBackup = null
    timeZoneBackup = null
    languageRegionFormErrors.value = {}
  }
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

// Minimum rate row spacing
.minimum-rate-row {
  &:not(:first-child) {
    margin-top: 24px;
  }
}

// Make add minimum rate button only as wide as its content
.add-minimum-rate-btn {
  width: fit-content !important;
}

// Label with delete button inline
.label-with-delete {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  span {
    flex: 0 0 auto;
  }

  .sm-button {
    margin-left: auto;
  }
}

// Make the sm-field-label full width ONLY for minimum rate rows
.minimum-rate-row :deep(.sm-input .sm-field-label) {
  width: 100% !important;
}

// Reduce spacing between label and input ONLY for inputs with interactive prefix
:deep(.has-interactive-prefix .sm-field-label) {
  margin-bottom: 4px !important;
}
</style>
