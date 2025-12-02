<template>
  <div class="slide-wrapper">
    <div class="slide-left">
      <div class="container-header">Current state</div>
      <div class="container-content">
        <img src="https://via.placeholder.com/600x400/E74C3C/ffffff?text=Preferences" alt="Preferences" />
        <img src="https://via.placeholder.com/600x300/F39C12/ffffff?text=Customize+Settings" alt="Settings" />
      </div>
    </div>

    <div class="slide-right">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <div class="form-container">
        <h2>Preferences</h2>
        <p>Customize your experience.</p>

        <div class="form-group">
          <label>Notification Preferences</label>
          <div class="checkbox-group">
            <label>
              <input v-model="formData.notifications.email" type="checkbox" />
              Email notifications
            </label>
            <label>
              <input v-model="formData.notifications.push" type="checkbox" />
              Push notifications
            </label>
            <label>
              <input v-model="formData.notifications.sms" type="checkbox" />
              SMS notifications
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Frequency</label>
          <select v-model="formData.frequency" class="form-input">
            <option value="realtime">Real-time</option>
            <option value="daily">Daily digest</option>
            <option value="weekly">Weekly summary</option>
            <option value="monthly">Monthly report</option>
          </select>
        </div>

        <div class="form-group">
          <label>Language</label>
          <select v-model="formData.language" class="form-input">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div class="form-group">
          <label>Theme</label>
          <div class="radio-group">
            <label>
              <input v-model="formData.theme" type="radio" value="light" />
              Light
            </label>
            <label>
              <input v-model="formData.theme" type="radio" value="dark" />
              Dark
            </label>
            <label>
              <input v-model="formData.theme" type="radio" value="auto" />
              Auto
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>
            <input v-model="formData.newsletter" type="checkbox" />
            Subscribe to newsletter for updates and special offers
          </label>
        </div>

        <SmButton type="primary" @click="handleSubmit">
          Save Preferences
        </SmButton>

        <div v-if="saveStatus" class="save-status">
          Preferences saved! Active notifications: {{ activeNotificationCount }}
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const formData = ref({
  notifications: {
    email: true,
    push: false,
    sms: false
  },
  frequency: 'daily',
  language: 'en',
  theme: 'auto',
  newsletter: true
})

const saveStatus = ref(false)

const activeNotificationCount = computed(() => {
  return Object.values(formData.value.notifications).filter(Boolean).length
})

const handleSubmit = () => {
  saveStatus.value = true
  console.log('Slide 4 form submitted:', formData.value)

  setTimeout(() => {
    saveStatus.value = false
  }, 3000)
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
    border-color: #E74C3C;
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

.checkbox-group,
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
  }
}

.save-status {
  margin-top: 1rem;
  padding: 1rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
}
</style>
