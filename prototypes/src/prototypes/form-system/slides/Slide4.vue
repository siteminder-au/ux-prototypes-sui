<template>
  <div class="slide-wrapper" :class="{ 'full-width': fullWidthForm }">

    <!-- LEFT: Reference Images -->
    <div v-if="!fullWidthForm" class="slide-left">
      <div class="container-header">Before / Production</div>
      <div class="container-content">
        <img :src="channelRateRef" alt="Channel rate reference" style="width: 100%; display: block;" />
      </div>
    </div>

    <!-- RIGHT: Proposed Implementation -->
    <div class="slide-right">
      <div class="container-header">Proposed</div>

      <!-- Drawer Header -->
      <div class="sm-drawer__header">
        <div class="sm-drawer__header-section sm-drawer__header-section--title">
          <h2>Channel rate configuration</h2>
          <p class="drawer-page-subtitle">Bulk assign test / Apartment</p>
        </div>
        <div class="sm-drawer__action-buttons">
          <div class="sm-drawer__header-section sm-drawer__header-section--actions">
            <SmButton type="tertiary" size="large" @click="handleCancel">
              Cancel
            </SmButton>
            <SmButton type="primary" size="large" native-type="submit" form="channel-rate-form">
              Save
            </SmButton>
          </div>
        </div>
      </div>

      <div class="container-content">
        <SmForm id="channel-rate-form" @submit="handleFormSubmit" @invalid-submit="handleInvalidSubmit">
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

            <!-- 1. PLEASE NOTE -->
            <SmFormGroup id="please-note">
              <h2 class="form-heading-1">Please Note</h2>
              <p>
                This channel does not support self-mapping. After submission we will process your request and notify you
                by email when it is finalised.
              </p>
            </SmFormGroup>

            <!-- 2. CHANNEL SETTINGS -->
            <SmFormGroup id="channel-settings">
              <h2 class="form-heading-1">Channel Settings</h2>

              <SmInput id="roomRateMapping" v-model="roomRateMapping" name="roomRateMapping"
                label="Bing Hotel Ads room rate to map" type="text" placeholder="Room rate test" rules="required" />
            </SmFormGroup>

            <!-- 3. RATE SETUP -->
            <SmFormGroup id="rate-setup">
              <h2 class="form-heading-1">Rate Setup</h2>

              <SmRadioGroup id="rateSetupType" name="rateSetupType" label="Rate setup method"
                button-alignment="vertical" rules="required" :error-disabled="true">
                <SmRadio name="rateSetupType" selected-value="manual" label="Manual" v-model="rateSetupType" />
                <SmRadio name="rateSetupType" selected-value="derived" v-model="rateSetupType" disabled>
                  <span style="display: inline-flex; align-items: center; gap: 4px;">
                    Derived
                    <SmTooltip
                      title="Rate setup limited to manual channel rate pricing due to Channel rate pricing mode is being enabled. To amend setup please contact support."
                      trigger="hover" placement="right">
                      <SmIcon name="utility-information-alt"
                        style="font-size: 16px; cursor: help; opacity: 1; color: var(--color-info, #0066CC);" />
                    </SmTooltip>
                  </span>
                </SmRadio>
              </SmRadioGroup>
            </SmFormGroup>

          </div>
        </SmForm>
      </div>
    </div>

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

// Import reference image
import channelRateRef from '/images/dynamic-form/channel-rate.png'

const { showGridOverlay, showContainerBackgrounds, fullWidthForm, showMarkup } = useDisplaySettings()

// Form data
const roomRateMapping = ref('')
const rateSetupType = ref('manual')

// Error handling
const formErrors = ref({})

const errorFieldsList = computed(() => {
  const fieldLabels = {
    roomRateMapping: 'Room rate mapping',
    rateSetupType: 'Rate setup method'
  }
  const fieldIds = {
    roomRateMapping: 'roomRateMapping',
    rateSetupType: 'rateSetupType'
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
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
</style>
