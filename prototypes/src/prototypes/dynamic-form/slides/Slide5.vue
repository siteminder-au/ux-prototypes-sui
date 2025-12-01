<template>
  <div class="slide-wrapper">
    <div class="slide-left">
      <div class="container-header">Current state</div>
      <div class="container-content">
        <img src="https://via.placeholder.com/600x400/1ABC9C/ffffff?text=Review+Summary" alt="Review" />
        <img src="https://via.placeholder.com/600x300/2ECC71/ffffff?text=Almost+Done!" alt="Complete" />
      </div>
    </div>

    <div class="slide-right">
      <div class="container-header">Proposed</div>
      <div class="container-content">
        <div class="form-container">
        <h2>Review & Submit</h2>
        <p>Please review your information before submitting.</p>

        <div class="review-section">
          <h3>Personal Information</h3>
          <div class="review-item">
            <span class="label">Name:</span>
            <span class="value">John Doe</span>
          </div>
          <div class="review-item">
            <span class="label">Email:</span>
            <span class="value">john.doe@example.com</span>
          </div>
          <div class="review-item">
            <span class="label">Phone:</span>
            <span class="value">+1 (555) 123-4567</span>
          </div>
        </div>

        <div class="review-section">
          <h3>Address</h3>
          <div class="review-item">
            <span class="label">Street:</span>
            <span class="value">123 Main Street, Apt 4B</span>
          </div>
          <div class="review-item">
            <span class="label">City:</span>
            <span class="value">New York, NY 10001</span>
          </div>
        </div>

        <div class="review-section">
          <h3>Preferences</h3>
          <div class="review-item">
            <span class="label">Notifications:</span>
            <span class="value">Email, SMS</span>
          </div>
          <div class="review-item">
            <span class="label">Frequency:</span>
            <span class="value">Daily digest</span>
          </div>
        </div>

        <div class="form-group">
          <label>Additional Comments (Optional)</label>
          <textarea
            v-model="formData.comments"
            class="form-textarea"
            rows="4"
            placeholder="Any additional information you'd like to share..."
          ></textarea>
        </div>

        <div class="form-group">
          <label>
            <input v-model="formData.confirmAccuracy" type="checkbox" />
            I confirm that all information provided is accurate
          </label>
        </div>

        <div class="button-group">
          <SmButton type="secondary" @click="handleEdit">
            Edit Information
          </SmButton>
          <SmButton
            type="primary"
            @click="handleFinalSubmit"
            :disabled="!formData.confirmAccuracy || isSubmitting"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </SmButton>
        </div>

        <div v-if="submitSuccess" class="success-banner">
          <h3>Success!</h3>
          <p>Your application has been submitted successfully. You will receive a confirmation email shortly.</p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  comments: '',
  confirmAccuracy: false
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const handleEdit = () => {
  console.log('Edit button clicked - would navigate back to edit')
}

const handleFinalSubmit = async () => {
  if (!formData.value.confirmAccuracy) return

  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))

  isSubmitting.value = false
  submitSuccess.value = true

  console.log('Final submission:', {
    comments: formData.value.comments,
    confirmed: formData.value.confirmAccuracy
  })
}
</script>

<style scoped lang="scss">
@import '../styles.scss';

.review-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1ABC9C;
    font-size: 1.1rem;
  }
}

.review-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  .label {
    font-weight: 500;
    color: #666;
  }

  .value {
    color: #333;
  }
}

.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1ABC9C;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.success-banner {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #1ABC9C 0%, #2ECC71 100%);
  border-radius: 8px;
  color: white;
  text-align: center;

  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
