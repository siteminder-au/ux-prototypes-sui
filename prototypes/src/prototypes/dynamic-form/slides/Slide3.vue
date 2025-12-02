<template>
  <div class="slide-wrapper">
    <div class="slide-left">
      <div class="container-header">Current state</div>
      <div class="container-content">
        <img src="https://via.placeholder.com/600x400/9B59B6/ffffff?text=Address+Details" alt="Address" />
        <img src="https://via.placeholder.com/600x300/3498DB/ffffff?text=Location+Info" alt="Location" />
      </div>
    </div>

    <div class="slide-right">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <div class="form-container">
        <h2>Address Details</h2>
        <p>Where should we send your information?</p>

        <div class="form-group">
          <label>Street Address</label>
          <input
            v-model="formData.streetAddress"
            type="text"
            placeholder="123 Main Street"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Apartment, Suite, etc. (Optional)</label>
          <input
            v-model="formData.apartment"
            type="text"
            placeholder="Apt 4B"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input
              v-model="formData.city"
              type="text"
              placeholder="New York"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>State/Province</label>
            <input
              v-model="formData.state"
              type="text"
              placeholder="NY"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>ZIP/Postal Code</label>
            <input
              v-model="formData.zipCode"
              type="text"
              placeholder="10001"
              class="form-input"
              @input="validateZipCode"
            />
          </div>

          <div class="form-group">
            <label>
              <input v-model="formData.sameAsBilling" type="checkbox" />
              Same as billing address
            </label>
          </div>
        </div>

        <SmButton type="primary" @click="handleSubmit" :disabled="!isValid">
          Continue
        </SmButton>

        <div v-if="formStatus" class="status-message" :class="formStatus.type">
          {{ formStatus.message }}
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const formData = ref({
  streetAddress: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  sameAsBilling: false
})

const formStatus = ref(null)

const isValid = computed(() => {
  return formData.value.streetAddress &&
         formData.value.city &&
         formData.value.state &&
         formData.value.zipCode
})

const validateZipCode = () => {
  const zipPattern = /^\d{5}(-\d{4})?$/
  if (formData.value.zipCode && !zipPattern.test(formData.value.zipCode)) {
    formStatus.value = { type: 'error', message: 'Invalid ZIP code format' }
  } else {
    formStatus.value = null
  }
}

const handleSubmit = () => {
  if (!isValid.value) {
    formStatus.value = { type: 'error', message: 'Please fill in all required fields' }
    return
  }

  formStatus.value = { type: 'success', message: 'Address saved successfully!' }
  console.log('Slide 3 form submitted:', formData.value)
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #9B59B6;
  }
}

.form-group {
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.status-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;

  &.success {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
  }

  &.error {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
  }
}
</style>
