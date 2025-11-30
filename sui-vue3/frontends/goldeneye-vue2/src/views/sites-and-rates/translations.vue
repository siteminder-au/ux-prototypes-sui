<script setup lang="ts">
import { ref } from 'vue'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.sites-and-rates.translations')
const form = ref({
  name: [
    { code: 'en', value: '' },
    { code: 'de', value: '' },
  ],
  description: [
    { code: 'en', value: '' },
    { code: 'de', value: '' },
  ],
})
const sending = ref(false)
// Form with global validators
const handleSave = () : void => {
  sending.value = true
  console.info('sending v-model values', JSON.stringify(form.value, null, 2))
  setTimeout(() => {
    sending.value = false
  }, 3000)
}
const supportedTranslations = [
  {
    code: 'en',
    translationLabel: 'English translation',
    dropdownLabel: 'English',
  },
  {
    code: 'es',
    translationLabel: 'Spanish translation',
    dropdownLabel: 'Spanish',
    disableDeletion: true,
  },
  {
    code: 'de',
    translationLabel: 'German translation',
    dropdownLabel: 'German',
  },
  {
    code: 'fr',
    translationLabel: 'French translation',
    dropdownLabel: 'French',
  },
  {
    code: 'pt',
    translationLabel: 'Portuguese translation',
    dropdownLabel: 'Portuguese',
  },
  {
    code: 'it',
    translationLabel: 'Italian translation',
    dropdownLabel: 'Italian',
  },
  {
    code: 'zh',
    translationLabel: 'Chinese translation',
    dropdownLabel: 'Chinese',
  },
]

const handleReset = (): void => {

  form.value.name = [
    { code: 'en', value: '' },
    { code: 'de', value: '' },
  ]
  form.value.description = [
    { code: 'en', value: '' },
    { code: 'de', value: '' },
  ]
}
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />
      <sm-form
        class="cm-max-w-lg"
        :disabled="sending"
        @submit="handleSave"
      >
        <template #default="{ invalid }">
          <sm-translations-input
            v-model="form.name"
            type="text"
            name="name"
            :label="t('campsite-name-translation-label')"
            :placeholder="t('campsite-name-translation-placeholder')"
            default-language="en"
            rules="required"
            :supported-translations="supportedTranslations"
          />

          <sm-translations-input
            v-model="form.description"
            type="textarea"
            name="description"
            :label="t('campsite-description-translation-label')"
            :placeholder="t('campsite-description-translation-placeholder')"
            default-language="en"
            :supported-translations="supportedTranslations"
          />

          <div class="text-right">
            <sm-button
              :disabled="sending"
              native-type="reset"
              type="text"
              @click="handleReset"
            >
              {{ t('cancel-button') }}
            </sm-button>
            <sm-button
              :disabled="invalid"
              :loading="sending"
              native-type="submit"
              type="primary"
            >
              {{ t('save-button') }}
            </sm-button>
          </div>
        </template>
      </sm-form>
    </sm-container>
  </sm-section>
</template>
