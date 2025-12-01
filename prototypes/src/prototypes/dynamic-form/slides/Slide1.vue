<template>
  <div class="slide-wrapper">
    <div class="slide-left">
      <div class="container-header">Current state</div>
      <div class="container-content">
        <img src="/images/dynamic-form/rate-plan-1.png" alt="Rate Plan 1" />
        <img src="/images/dynamic-form/rate-plan-2.png" alt="Rate Plan 2" />
        <img src="/images/dynamic-form/rate-plan-3.png" alt="Rate Plan 3" />
        <img src="/images/dynamic-form/rate-plan-4.png" alt="Rate Plan 4" />
      </div>
    </div>

    <div class="slide-right">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <div class="form-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h2 style="margin-bottom: 0.25rem;">Edit rate plan</h2>
            <p style="margin: 0; color: #666;">Advance purchase</p>
          </div>
          <div style="display: flex; gap: 1rem;">
            <SmButton type="secondary" @click="handleCancel">
              Cancel
            </SmButton>
            <SmButton type="primary" @click="handleSubmit" :disabled="!isValid">
              Save
            </SmButton>
          </div>
        </div>

        <h3 style="font-size: 0.875rem; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 1.5rem;">GENERAL INFORMATION</h3>

        <SmFormGroup label="Rate plan name" required>
          <SmInput
            name="ratePlanName"
            v-model="formData.ratePlanName"
            placeholder="Enter rate plan name"
          />
        </SmFormGroup>

        <SmFormGroup label="Rate plan description">
          <SmInput
            name="description"
            v-model="formData.description"
            type="textarea"
            placeholder="Enter description"
            :rows="4"
          />
        </SmFormGroup>

        <h3 style="font-size: 0.875rem; font-weight: 700; letter-spacing: 0.5px; margin: 2rem 0 1.5rem;">RESTRICTIONS AND INCLUSIONS</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <SmFormGroup label="Default minimum stay">
            <SmInput
              name="minStay"
              v-model="formData.minStay"
              type="number"
              placeholder=""
            />
          </SmFormGroup>

          <SmFormGroup label="Default maximum stay">
            <SmInput
              name="maxStay"
              v-model="formData.maxStay"
              type="number"
              placeholder=""
            />
          </SmFormGroup>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <SmFormGroup label="Release period">
            <SmInput
              name="releasePeriod"
              v-model="formData.releasePeriod"
              type="number"
              placeholder=""
            />
          </SmFormGroup>

          <SmFormGroup label="Inclusions">
            <SmSelect
              name="inclusions"
              v-model="formData.inclusions"
              :options="inclusionOptions"
              placeholder="Select inclusions"
              allow-empty
            />
          </SmFormGroup>
        </div>

        <div v-if="submitted" class="success-message">
          Rate plan saved successfully!
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inclusionOptions = [
  { label: 'Breakfast', code: 'breakfast' },
  { label: 'Parking', code: 'parking' },
  { label: 'WiFi', code: 'wifi' }
]

const formData = ref({
  ratePlanName: '',
  description: '',
  minStay: '',
  maxStay: '',
  releasePeriod: '',
  inclusions: null
})

const submitted = ref(false)

const isValid = computed(() => {
  return formData.value.ratePlanName !== ''
})

const handleSubmit = () => {
  if (isValid.value) {
    submitted.value = true
    console.log('Slide 1 form submitted:', formData.value)
  }
}

const handleCancel = () => {
  console.log('Cancel clicked')
}
</script>

<style scoped lang="scss">
@import '../styles.scss';

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
}
</style>
