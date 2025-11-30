<script setup lang="ts">
import { ref } from 'vue'
import { SmButton, SmButtonType } from '@siteminder/sui-core/components/sm-button'
import { SmInputType } from '@siteminder/sui-core/components/forms/sm-input'
import { SmTranslationsInput, SmTranslationsInputSupportedTranslation } from '@siteminder/sui-core/components/forms/sm-translations-input'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.sites-and-rates.translations')

const initialValue = {
  name: [
    { code: 'en', value: '' },
    { code: 'de', value: '' },
  ],
  description: [
    { code: 'en', value: '' },
    { code: 'de', value: '' },
  ],
}
// Form with global validators
const form = ref(initialValue)

const sending = ref(false)

// Form with global validators
const handleSave = (e: unknown) : void => {
  sending.value = true

  console.info('sending v-model values', JSON.stringify(form.value, null, 2))
  console.info('sending @submit payload values', e)

  setTimeout(() => {
    sending.value = false
  }, 3000)
}
const supportedTranslations: SmTranslationsInputSupportedTranslation[] = [
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
  // vee-validate does not reset the languages array by default. It only resets the values
  // Manually reset translation list to initial value
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
        v-model="form"
        class="cm-max-w-lg"
        :disabled="sending"
        :initial-values="initialValue"
        @submit="handleSave"
      >
        <template #default="{ invalid }">
          <sm-translations-input
            v-model="form.name"
            :type="SmInputType.TEXT"
            name="name"
            :label="t('campsite-name-translation-label')"
            :placeholder="t('campsite-name-translation-placeholder')"
            default-language="en"
            rules="required"
            :supported-translations="supportedTranslations"
          />

          <sm-translations-input
            v-model="form.description"
            :type="SmInputType.TEXTAREA"
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
              :type="SmButtonType.TEXT"
              @click="handleReset"
            >
              {{ t('cancel-button') }}
            </sm-button>
            <sm-button
              :disabled="invalid"
              :loading="sending"
              native-type="submit"
              :type="SmButtonType.PRIMARY"
            >
              {{ t('save-button') }}
            </sm-button>
          </div>
        </template>
      </sm-form>
    </sm-container>
  </sm-section>
</template>
