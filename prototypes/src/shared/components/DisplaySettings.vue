<template>
  <div class="settings-section">
    <h3 class="settings-section-title">Display Controls</h3>
    <div class="toggle-item">
      <label class="toggle-label">
        <input type="checkbox" v-model="showGridOverlay" id="grid-overlay-toggle" />
        <span>Show Grid Overlay</span>
      </label>
    </div>
    <div class="toggle-item">
      <label class="toggle-label">
        <input type="checkbox" v-model="showContainerBackgrounds" id="debug-backgrounds-toggle" />
        <span>Show Debug Backgrounds</span>
      </label>
    </div>
    <div class="toggle-item">
      <label class="toggle-label">
        <input type="checkbox" v-model="fullWidthForm" id="full-width-form-toggle" />
        <span>Full width form</span>
      </label>
    </div>
    <div class="toggle-item">
      <label class="toggle-label">
        <input type="checkbox" v-model="showMarkup" id="show-markup-toggle" />
        <span>Show Markup</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { useDisplaySettings } from '@/shared/composables/useDisplaySettings.js'

// Get shared display settings
const { showGridOverlay, showContainerBackgrounds, fullWidthForm, showMarkup } = useDisplaySettings()
</script>
