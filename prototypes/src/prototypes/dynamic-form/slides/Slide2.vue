<template>
  <div class="slide-wrapper">
    <div class="slide-left">
      <div class="container-header">Current state</div>
      <div class="container-content">
        <img src="https://via.placeholder.com/600x400/50C878/ffffff?text=Personal+Info" alt="Personal Information" />
        <img src="https://via.placeholder.com/600x300/FF6B6B/ffffff?text=Important+Details" alt="Important Details" />
      </div>
    </div>

    <div class="slide-right">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <div class="form-container">
        <h2>Personal Information</h2>
        <p>Tell us more about yourself.</p>

        <div class="form-group">
          <label>Date of Birth</label>
          <input
            v-model="formData.dateOfBirth"
            type="date"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Country</label>
          <select v-model="formData.country" class="form-input">
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="au">Australia</option>
            <option value="ca">Canada</option>
          </select>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Preferred Contact Method</label>
          <div class="radio-group">
            <label>
              <input v-model="formData.contactMethod" type="radio" value="email" />
              Email
            </label>
            <label>
              <input v-model="formData.contactMethod" type="radio" value="phone" />
              Phone
            </label>
            <label>
              <input v-model="formData.contactMethod" type="radio" value="sms" />
              SMS
            </label>
          </div>
        </div>

        <SmButton type="primary" @click="handleSubmit" :disabled="!isValid">
          Continue
        </SmButton>

        <div v-if="validationError" class="error-message">
          {{ validationError }}
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const formData = ref({
  dateOfBirth: '',
  country: '',
  phone: '',
  contactMethod: 'email'
})

const validationError = ref('')

const isValid = computed(() => {
  return formData.value.dateOfBirth &&
         formData.value.country &&
         formData.value.phone
})

const handleSubmit = () => {
  if (!isValid.value) {
    validationError.value = 'Please fill in all required fields'
    return
  }

  validationError.value = ''
  console.log('Slide 2 form submitted:', formData.value)
}
</script>

<style scoped lang="scss">
@import '../styles.scss';

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #50C878;
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

.radio-group {
  display: flex;
  gap: 1rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
  }
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
}
</style>
