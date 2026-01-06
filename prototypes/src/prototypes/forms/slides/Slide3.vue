<template>
  <div class="slide-wrapper" :class="{ 'full-width': fullWidthForm }">

    <!-- LEFT: Reference Images -->
    <div v-if="!fullWidthForm" class="slide-left">
      <div class="container-header">Before / Production</div>
      <div class="container-content">
        <img :src="roomTypeRef1" alt="Room type reference 1" style="width: 100%; display: block;" />
        <img :src="roomTypeRef2" alt="Room type reference 2"
          style="width: 100%; display: block; margin-top: 1rem;" />
        <img :src="roomTypeRef3" alt="Room type reference 3"
          style="width: 100%; display: block; margin-top: 1rem;" />
      </div>
    </div>

    <!-- RIGHT: Proposed Implementation -->
    <div class="slide-right">
      <div class="container-header">Proposed</div>

      <!-- Drawer Header -->
      <div class="sm-drawer__header">
        <div class="sm-drawer__header-section sm-drawer__header-section--title">
          <h2>Edit room type</h2>
          <p class="drawer-page-subtitle">Apartment</p>
        </div>
        <div class="sm-drawer__action-buttons">
          <div class="sm-drawer__header-section sm-drawer__header-section--actions">
            <SmButton type="tertiary" size="large" @click="handleCancel">
              Cancel
            </SmButton>
            <SmButton type="primary" size="large" native-type="submit" form="room-type-form">
              Save
            </SmButton>
          </div>
        </div>
      </div>

      <div class="container-content">
        <SmForm id="room-type-form" @submit="handleFormSubmit" @invalid-submit="handleInvalidSubmit">
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

              <SmSelect id="roomCategory" v-model="roomCategory" name="roomCategory" label="Room category"
                placeholder="Select room category" :options="roomCategoryOptions" :mandatory="true">
                <template #action>
                  <SmTooltip
                    title="The category of accommodation being provided. This is not visible to guests."
                    trigger="hover" placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                  </SmTooltip>
                </template>
              </SmSelect>

              <SmSelect id="roomTypeName" v-model="roomTypeName" name="roomTypeName" label="Room type name"
                :options="[{ label: 'Apartment', code: 'Apartment' }]" :mandatory="true">
                <template #action>
                  <SmTooltip title="The name of the room type as it appears to guests" trigger="hover"
                    placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                  </SmTooltip>
                </template>
              </SmSelect>

              <SmInput id="internalRoomTypeName" v-model="internalRoomTypeName" name="internalRoomTypeName"
                label="Internal room type name" :mandatory="true">
                <template #action>
                  <SmTooltip
                    title="This will help you identify your room types internally. For example, use an acronym, code, or custom name."
                    trigger="hover" placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                  </SmTooltip>
                </template>
              </SmInput>

              <SmInput id="descriptionForGuest" v-model="descriptionForGuest" name="descriptionForGuest"
                label="Description for guest" type="textarea" :rows="4" placeholder="Enter a description for guests"
                :mandatory="true">
                <template #action>
                  <SmTooltip title="This description will be shown to guests when viewing this room type"
                    trigger="hover" placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                  </SmTooltip>
                </template>
              </SmInput>

              <SmInput id="customRoomTypeName" v-model="customRoomTypeName" name="customRoomTypeName"
                label="Custom room type name (Booking Engine only)" placeholder="Add custom room type name" />

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="numberOfRooms" v-model="numberOfRooms" name="numberOfRooms"
                    label="Number of rooms of this type" type="number" :min="1" :mandatory="true" />
                </div>
              </div>
            </SmFormGroup>

            <!-- 2. OCCUPANCY -->
            <SmFormGroup id="occupancy">
              <h2 class="form-heading-1">Occupancy</h2>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="maximumOccupancy" v-model="maximumOccupancy" name="maximumOccupancy"
                    label="Maximum occupancy" type="number" :min="1" :mandatory="true" />
                </div>
                <div class="form-col">
                  <SmInput id="maximumAdults" v-model="maximumAdults" name="maximumAdults" label="Maximum adults"
                    type="number" :min="1" :mandatory="true" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="maximumChildren" v-model="maximumChildren" name="maximumChildren"
                    label="Maximum children" type="number" :min="0" :mandatory="true" />
                </div>
                <div class="form-col">
                  <SmInput id="maximumInfants" v-model="maximumInfants" name="maximumInfants" label="Maximum infants"
                    type="number" :min="0" :mandatory="true" />
                </div>
              </div>
            </SmFormGroup>

            <!-- 3. FEATURES -->
            <SmFormGroup id="features">
              <h2 class="form-heading-1">Features</h2>

              <div class="form-row">
                <div class="form-col">
                  <SmInput id="roomSize" v-model="roomSize" name="roomSize" label="Room size">
                    <template #suffix>
                      <SmInputSuffixContent>SQM(m²)</SmInputSuffixContent>
                    </template>
                  </SmInput>
                </div>
                <div class="form-col">
                  <SmSelect id="bathrooms" v-model="bathrooms" name="bathrooms" label="Bathrooms"
                    :options="bathroomOptions" />
                </div>
              </div>

              <SmRadioGroup label="Smoking policy" v-model="smokingPolicy" name="smokingPolicy">
                <SmRadio v-model="smokingPolicy" name="smokingPolicy" selected-value="non-smoking"
                  label="Non-smoking" :error-disabled="true" />
                <SmRadio v-model="smokingPolicy" name="smokingPolicy" selected-value="smoking" label="Smoking"
                  :error-disabled="true" />
              </SmRadioGroup>

              <SmSelect id="roomView" v-model="roomView" name="roomView" label="Room view"
                placeholder="Search and select a room view" :options="roomViewOptions" :multiple="true"
                :filterable="true" />

              <SmSelect id="amenitiesFacilities" v-model="amenitiesFacilities" name="amenitiesFacilities"
                label="Amenities and facilities" placeholder="Search and select amenities and facilities"
                :options="amenitiesFacilitiesOptions" :multiple="true" :filterable="true" />
            </SmFormGroup>

            <!-- 4. BED TYPE CONFIGURATION -->
            <SmFormGroup id="bed-type-configuration">
              <h2 class="form-heading-1">Bed Type Configuration</h2>

              <!-- Simple bed types (no bedrooms) -->
              <div v-if="bedrooms.length === 0">
                <div class="bed-types-list">
                  <div v-for="(bedType, index) in bedTypes" :key="index" class="bed-type-item">
                    <div class="bed-type-container">
                      <div class="bed-type-field bed-type-field--type">
                        <SmSelect :id="`bedType${index}`" v-model="bedType.type" :name="`bedType${index}`"
                          label="Bed type" placeholder="Select bed type" :options="bedTypeOptions" />
                      </div>
                      <div class="bed-type-field bed-type-field--count">
                        <SmSelect :id="`bedCount${index}`" v-model="bedType.count" :name="`bedCount${index}`"
                          label="Number of type" :options="bedCountOptions" />
                      </div>
                      <button type="button" class="bed-type-delete-btn" @click="removeBedType(index)">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <SmButton v-if="bedTypes.length < 10" type="text" size="large" @click="addBedType">
                  <SmIcon name="controls-add" />
                  Add bed type
                </SmButton>
                <div v-else class="bed-type-limit-message">
                  Maximum of 10 bed types reached
                </div>
              </div>

              <!-- Bedrooms structure -->
              <div v-else class="bedrooms-wrapper">
                <!-- Card style -->
                <SmCard v-if="bedroomUIStyle === 'cards'" v-for="(bedroom, bedroomIndex) in bedrooms" :key="bedroom.id"
                  class="bedroom-card" :interactive="false">
                  <SmCardContent>
                    <div class="bedroom-content">
                      <div class="bedroom-header">
                        <h3 class="form-heading-2">Bedroom {{ bedroomIndex + 1 }}</h3>
                        <SmButton type="button" shape="round" size="medium" @click="removeBedroom(bedroom.id)"
                          aria-label="Delete bedroom">
                          <SmIcon name="action-remove" style="color: var(--color-warning);" />
                        </SmButton>
                      </div>

                      <div class="bed-types-list">
                        <div v-for="(bedType, bedTypeIndex) in bedroom.bedTypes" :key="`${bedroom.id}-${bedTypeIndex}`"
                          class="bed-type-item">
                          <div class="bed-type-container">
                            <div class="bed-type-field bed-type-field--type">
                              <SmSelect :id="`bedType-${bedroom.id}-${bedTypeIndex}`" v-model="bedType.type"
                                :name="`bedroom${bedroom.id}BedType${bedTypeIndex}`" label="Bed type"
                                placeholder="Select bed type" :options="bedTypeOptions" />
                            </div>
                            <div class="bed-type-field bed-type-field--count">
                              <SmSelect :id="`bedCount-${bedroom.id}-${bedTypeIndex}`" v-model="bedType.count"
                                :name="`bedroom${bedroom.id}BedCount${bedTypeIndex}`" label="Number of type"
                                :options="bedCountOptions" />
                            </div>
                            <button type="button" class="bed-type-delete-btn"
                              @click="removeBedTypeFromBedroom(bedroom.id, bedTypeIndex)">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      <SmButton v-if="bedroom.bedTypes.length < 10" type="text" size="large"
                        @click="addBedTypeToBedroom(bedroom.id)">
                        <SmIcon name="controls-add" />
                        Add bed type
                      </SmButton>
                      <div v-else class="bed-type-limit-message">
                        Maximum of 10 bed types reached
                      </div>
                    </div>
                  </SmCardContent>
                </SmCard>

                <!-- Text-only style -->
                <div v-if="bedroomUIStyle === 'text-only'" v-for="(bedroom, bedroomIndex) in bedrooms" :key="bedroom.id"
                  class="bedroom-text-only">
                  <div class="bedroom-header">
                    <h3 class="form-heading-2">Bedroom {{ bedroomIndex + 1 }}</h3>
                    <SmButton type="text-warning" size="small" @click="removeBedroom(bedroom.id)">
                      Delete
                    </SmButton>
                  </div>

                  <div class="bed-types-list">
                    <div v-for="(bedType, bedTypeIndex) in bedroom.bedTypes" :key="`${bedroom.id}-${bedTypeIndex}`"
                      class="bed-type-item">
                      <div class="bed-type-container">
                        <div class="bed-type-field bed-type-field--type">
                          <SmSelect :id="`bedType-${bedroom.id}-${bedTypeIndex}`" v-model="bedType.type"
                            :name="`bedroom${bedroom.id}BedType${bedTypeIndex}`" label="Bed type"
                            placeholder="Select bed type" :options="bedTypeOptions" />
                        </div>
                        <div class="bed-type-field bed-type-field--count">
                          <SmSelect :id="`bedCount-${bedroom.id}-${bedTypeIndex}`" v-model="bedType.count"
                            :name="`bedroom${bedroom.id}BedCount${bedTypeIndex}`" label="Number of type"
                            :options="bedCountOptions" />
                        </div>
                        <button type="button" class="bed-type-delete-btn"
                          @click="removeBedTypeFromBedroom(bedroom.id, bedTypeIndex)">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <SmButton v-if="bedroom.bedTypes.length < 10" type="text" size="large"
                    @click="addBedTypeToBedroom(bedroom.id)">
                    <SmIcon name="controls-add" />
                    Add bed type
                  </SmButton>
                  <div v-else class="bed-type-limit-message">
                    Maximum of 10 bed types reached
                  </div>
                </div>
              </div>

              <!-- Add bedroom button -->
              <SmButton v-if="bedTypes.length > 0 || bedrooms.length > 0" type="text" size="large" @click="addBedroom"
                style="margin-top: 16px;">
                <SmIcon name="controls-add" />
                Add bedroom
              </SmButton>
            </SmFormGroup>

            <!-- 5. MEDIA -->
            <SmFormGroup id="media">
              <h2 class="form-heading-1">Media</h2>

              <div class="media-container">
                <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                  <SmButton type="text" size="large">
                    <SmIcon name="controls-add" />
                    Assign from Media library
                  </SmButton>
                </div>

                <!-- Media display area -->
                <div class="media-display-area">
                  <div class="media-grid">
                    <div v-for="image in mediaImages" :key="image.id" class="media-item">
                      <img :src="image.url" :alt="image.alt" />
                    </div>
                  </div>
                </div>
              </div>
            </SmFormGroup>

            <!-- 6. DELETE ROOM TYPE -->
            <div class="delete-room-type-section">
              <SmButton type="secondary-warning" @click="handleDelete">
                <SmIcon name="action-delete" />
                Delete room type
              </SmButton>
            </div>

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
import roomTypeRef1 from '/images/dynamic-form/room-type-1.png'
import roomTypeRef2 from '/images/dynamic-form/room-type-2.png'
import roomTypeRef3 from '/images/dynamic-form/room-type-3.png'

const { showGridOverlay, showContainerBackgrounds, fullWidthForm, showMarkup } = useDisplaySettings()

// Form data - General Information
const roomCategory = ref('Apartment')
const roomTypeName = ref('Apartment')
const internalRoomTypeName = ref('Apartamento')
const descriptionForGuest = ref('')
const customRoomTypeName = ref('')
const numberOfRooms = ref(2)

// Form data - Occupancy
const maximumOccupancy = ref(2)
const maximumAdults = ref(1)
const maximumChildren = ref(1)
const maximumInfants = ref(1)

// Form data - Features
const roomSize = ref('')
const bathrooms = ref('1')
const smokingPolicy = ref('non-smoking')
const roomView = ref([])
const amenitiesFacilities = ref([])

// Form data - Bed Types
const bedTypes = ref([
  { type: '', count: 1 }
])

// Bedrooms array (hierarchical structure)
const bedrooms = ref([])
let bedroomIdCounter = 0

// Bedroom UI style ('cards' or 'text-only')
const bedroomUIStyle = ref('cards')

// Media images
const mediaImages = ref([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    alt: 'Beach sunset'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400',
    alt: 'Forest'
  }
])

// Options
const roomCategoryOptions = [
  { label: 'Apartment', code: 'Apartment' },
  { label: 'Bed in Dormitory', code: 'Bed in Dormitory' },
  { label: 'Bungalow', code: 'Bungalow' },
  { label: 'Chalet', code: 'Chalet' },
  { label: 'Dormitory room', code: 'Dormitory room' },
  { label: 'Double', code: 'Double' },
  { label: 'Family', code: 'Family' },
  { label: 'Holiday home', code: 'Holiday home' },
  { label: 'Mobile home', code: 'Mobile home' },
  { label: 'Quadruple', code: 'Quadruple' },
  { label: 'Single', code: 'Single' },
  { label: 'Studio', code: 'Studio' },
  { label: 'Suite', code: 'Suite' },
  { label: 'Tent', code: 'Tent' },
  { label: 'Triple', code: 'Triple' },
  { label: 'Twin', code: 'Twin' },
  { label: 'Villa', code: 'Villa' }
]

const bathroomOptions = [
  { label: '1', code: '1' },
  { label: '2', code: '2' },
  { label: '3', code: '3' }
]

const bedTypeOptions = [
  { label: 'Double', code: 'Double' },
  { label: 'Futon', code: 'Futon' },
  { label: 'King', code: 'King' },
  { label: 'Queen', code: 'Queen' },
  { label: 'Sofa bed', code: 'Sofa bed' },
  { label: 'Tatami mats', code: 'Tatami mats' }
]

const bedCountOptions = Array.from({ length: 10 }, (_, i) => ({
  label: String(i + 1),
  code: i + 1
}))

const roomViewOptions = [
  { label: 'Airport', code: 'Airport' },
  { label: 'Bay', code: 'Bay' },
  { label: 'Beach', code: 'Beach' },
  { label: 'City', code: 'City' },
  { label: 'Countryside', code: 'Countryside' },
  { label: 'Courtyard', code: 'Courtyard' }
]

const amenitiesFacilitiesOptions = [
  { label: 'Air conditioning', code: 'air-conditioning' },
  { label: 'Balcony', code: 'balcony' },
  { label: 'Coffee maker', code: 'coffee-maker' },
  { label: 'Desk', code: 'desk' },
  { label: 'Fireplace', code: 'fireplace' },
  { label: 'Hairdryer', code: 'hairdryer' },
  { label: 'Iron', code: 'iron' },
  { label: 'Kitchen', code: 'kitchen' },
  { label: 'Minibar', code: 'minibar' },
  { label: 'Safe', code: 'safe' },
  { label: 'TV', code: 'tv' },
  { label: 'WiFi', code: 'wifi' }
]

// Bed type management
const addBedType = () => {
  if (bedTypes.value.length < 10) {
    bedTypes.value.push({ type: '', count: 1 })
  }
}

const removeBedType = (index) => {
  bedTypes.value.splice(index, 1)
}

// Bedroom management
const addBedroom = () => {
  // If this is the first bedroom, migrate existing bed types to "Bedroom 1"
  if (bedrooms.value.length === 0 && bedTypes.value.length > 0) {
    bedrooms.value.push({
      id: ++bedroomIdCounter,
      bedTypes: [...bedTypes.value]
    })
    bedTypes.value = []
  } else {
    // Add new bedroom with one empty bed type
    bedrooms.value.push({
      id: ++bedroomIdCounter,
      bedTypes: [{ type: '', count: 1 }]
    })
  }
}

const removeBedroom = (bedroomId) => {
  const index = bedrooms.value.findIndex(b => b.id === bedroomId)
  if (index !== -1) {
    // Check if this is the last bedroom
    if (bedrooms.value.length === 1) {
      // Migrate the bed types back to simple list and clear bedrooms
      bedTypes.value = [...bedrooms.value[0].bedTypes]
      bedrooms.value = []
    } else {
      // Just remove this bedroom
      bedrooms.value.splice(index, 1)
    }
  }
}

const addBedTypeToBedroom = (bedroomId) => {
  const bedroom = bedrooms.value.find(b => b.id === bedroomId)
  if (bedroom && bedroom.bedTypes.length < 10) {
    bedroom.bedTypes.push({ type: '', count: 1 })
  }
}

const removeBedTypeFromBedroom = (bedroomId, bedTypeIndex) => {
  const bedroom = bedrooms.value.find(b => b.id === bedroomId)
  if (bedroom) {
    bedroom.bedTypes.splice(bedTypeIndex, 1)
  }
}

// Error handling
const formErrors = ref({})

const errorFieldsList = computed(() => {
  const fieldLabels = {
    roomCategory: 'Room category',
    roomTypeName: 'Room type name',
    internalRoomTypeName: 'Internal room type name',
    descriptionForGuest: 'Description for guest',
    numberOfRooms: 'Number of rooms of this type',
    maximumOccupancy: 'Maximum occupancy',
    maximumAdults: 'Maximum adults',
    maximumChildren: 'Maximum children',
    maximumInfants: 'Maximum infants'
  }
  const fieldIds = {
    roomCategory: 'roomCategory',
    roomTypeName: 'roomTypeName',
    internalRoomTypeName: 'internalRoomTypeName',
    descriptionForGuest: 'descriptionForGuest',
    numberOfRooms: 'numberOfRooms',
    maximumOccupancy: 'maximumOccupancy',
    maximumAdults: 'maximumAdults',
    maximumChildren: 'maximumChildren',
    maximumInfants: 'maximumInfants'
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

const handleDelete = () => {
  console.log('Delete room type clicked')
  // Show confirmation dialog
}
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

// ============================================================================
// BED TYPE CONFIGURATION
// ============================================================================
.bed-types-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.bed-type-item {
  margin-bottom: 16px;
}

.bed-type-container {
  display: flex;
  gap: 16px;
  align-items: flex-end;

  .bed-type-field {
    flex: 1;

    &--type {
      flex: 2;
    }

    &--count {
      flex: 1;
    }
  }

  .bed-type-delete-btn {
    background: none;
    border: none;
    color: var(--color-app-warning, #d92d20);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
    height: 40px;

    &:hover {
      background: var(--color-grey-neu-light, #f2f4f7);
    }
  }
}

.bed-type-limit-message {
  font-size: 13px;
  color: #667085;
  padding: 8px 0;
}

// Note: Bedroom card styling (background, border, border-radius) comes from global SmCard override in sui-overrides.scss

// Bedroom text-only style
.bedroom-text-only {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

// ============================================================================
// MEDIA LIBRARY SECTION
// ============================================================================
.media-container {
  display: flex;
  flex-direction: column;
}

.media-display-area {
  border: 2px dashed var(--color-grey-neu-light, #d0d5dd);
  border-radius: 8px;
  padding: 24px;
  background: var(--color-true-white, #ffffff);
  min-height: 150px;
}

.media-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.media-item {
  width: 160px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// ============================================================================
// DELETE ROOM TYPE SECTION
// ============================================================================
.delete-room-type-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e0e0e0;
}
</style>
