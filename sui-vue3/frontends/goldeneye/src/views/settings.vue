<script setup lang="ts">
import { SmForm } from '@siteminder/sui-core/components/forms/sm-form'
import { SmFormGroup } from '@siteminder/sui-core/components/forms/sm-form-group'
import { SmRadio, SmRadioGroup } from '@siteminder/sui-core/components/forms/sm-radio'
import { selectedLanguage, selectedWhiteLabel, Language, WhiteLabelColour, useGlobalSettings, themeMode, ThemeMode, SuiThemeProduct, SuiCoreThemeProduct } from '@/composables/use-global-settings'
import { useTranslate } from '@/composables/use-translate'
import { loadLanguageAsync } from '@/services/i18n'
import { ref, watch } from 'vue'

const { t } = useTranslate('views.settings')

// NOTE: there is a conflict between sui-theme and white-labelling when used together
// sometimes sui-theme styling always wins as it has higher css specificity
// for example for sm-app-header:
// - sui-themes: body .sm-app-header .sm-horizontal-nav .sm-horizontal-nav-item--active .sm-horizontal-nav-item__content
// - white-labelling: .sm-horizontal-nav-item--active .sm-horizontal-nav-item__content
// give a warning not to use white-labelling and sui-themes together!
const { language, whiteLabel, suiTheme, suiCoreTheme, isWhiteLabelModeEnabled } = useGlobalSettings()

// #region theming section
const whiteLabelColourLabels = ref({
  [WhiteLabelColour.BLUE]: t('blue-theme-radio-option-label'),
  [WhiteLabelColour.RED]: t('red-theme-radio-option-label'),
  [WhiteLabelColour.GREEN]: t('green-theme-radio-option-label'),
  [WhiteLabelColour.SLATE]: t('slate-theme-radio-option-label'),
})

// see: https://www.rapidtables.com/web/css/css-color.html
// best way to test these css variables with profound visual changes are
// walk through the primary colours RGB
// --primary-background: nav item active bottom border colour
// --primary-foreground: nav item active bg colour
// --secondary-background: top app-header bg colour
// --secondary-foreground: top app-header text colour; must contrast with --secondary-background
// --tertiary-background: horizontal nav bg colour
// --tertiary-foreground: horizontal nav text colour; must contrast with --tertiary-background
const whiteLabelColours: Record<WhiteLabelColour, Record<string, string>> = {
  [WhiteLabelColour.BLUE]: {
    // defaults from libs/sui-core/src/app/common/white-labelling/white-labelling.scss
    'primary-background': '#006ADD',
    'primary-foreground': '#E6EBF2',
    'secondary-background': '#006ADE',
    'secondary-foreground': '#FFFFFF',
    'tertiary-background': '#FFFFFF',
    'tertiary-foreground': '#333333',
  },
  [WhiteLabelColour.RED]: {
    'primary-background': '#B22222', // firebrick
    'primary-foreground': '#FF0000', // red
    'secondary-background': '#8B0000', // darkred
    'secondary-foreground': '#FFA07A', // lightsalmon
    'tertiary-background': '#D11D1D', // from sm-tag
    'tertiary-foreground': '#FCEEEE', // from sm-tag
  },
  [WhiteLabelColour.GREEN]: {
    'primary-background': '#228B22', // forestgreen
    'primary-foreground': '#008000', // green
    'secondary-background': '#006400', // darkgreen
    'secondary-foreground': '#7CFC00', // lawngreen
    'tertiary-background': '#1B7B3E', // from sm-tag
    'tertiary-foreground': '#E2F4EB', // from sm-tag
  },
  [WhiteLabelColour.SLATE]: {
    'primary-background': '#C2B59B',
    'primary-foreground': '#B0B0B0',
    'secondary-background': '#3B444B',
    'secondary-foreground': '#FFFFFF',
    'tertiary-background': '#5A6B6F',
    'tertiary-foreground': '#FFFFFF',
  },
}

const setDocumentElementStyle = (propertyName: string, color: string): void => {
  document.documentElement.style.setProperty(propertyName, color)
}

// white-label way of theming
watch(whiteLabel, (newValue) => {
  if (themeMode.value !== ThemeMode.WHITE_LABEL) {
    themeMode.value = ThemeMode.WHITE_LABEL
  }

  setDocumentElementStyle('--secondary-background', whiteLabelColours[newValue]['secondary-background'])
  setDocumentElementStyle('--secondary-foreground', whiteLabelColours[newValue]['secondary-foreground'])
  setDocumentElementStyle('--tertiary-background', whiteLabelColours[newValue]['tertiary-background'])
  setDocumentElementStyle('--tertiary-foreground', whiteLabelColours[newValue]['tertiary-foreground'])
  setDocumentElementStyle('--primary-background', whiteLabelColours[newValue]['primary-background'])
  setDocumentElementStyle('--primary-foreground', whiteLabelColours[newValue]['primary-foreground'])
})

// sui-themes way of theming
const suiThemeLabels = ref({
  [SuiThemeProduct.LITTLE_HOTELIER]: 'Little Hotelier',
  [SuiThemeProduct.MULTI_PROPERTY]: 'Multi-Property',
  [SuiThemeProduct.PLATFORM_PAY]: 'Platform Pay',
})

// co-located theming tokens in sui-core
const suiCoreThemeLabels = ref({
  [SuiCoreThemeProduct.NONE]: 'None',
  [SuiCoreThemeProduct.CAMPMINDER]: 'CampMinder',
})

watch(suiTheme, async (newValue) => {
  if (!newValue) {
    return
  }

  if (themeMode.value === ThemeMode.SUI_THEMES) {
    // don't allow going to sui-themes more than once
    return
  }

  await import('@siteminder/sui-themes/sui-theme.esm.css')

  if (newValue === SuiThemeProduct.LITTLE_HOTELIER) {
    await import('@/assets/styles/little-hotelier.css')
  } else if (newValue === SuiThemeProduct.MULTI_PROPERTY) {
    await import('@/assets/styles/multi-property.css')
  } else {
    await import('@/assets/styles/platform-pay.css')
  }

  themeMode.value = ThemeMode.SUI_THEMES
})

watch(suiCoreTheme, async (newValue) => {
  if (!newValue) {
    return
  }

  if (newValue === SuiCoreThemeProduct.CAMPMINDER) {
    // Lazy-load the CampMinder theme
    await import('@/assets/styles/campminder.css')

    // But activate it only when the class is added to the document element
    document.documentElement.classList.add('campminder-theme')
  } else {
    // Remove the class to deactivate the CampMinder theme
    document.documentElement.classList.remove('campminder-theme')
  }

  themeMode.value = ThemeMode.SUI_CORE_THEMES
})

// don't bother translating this as it's targetted for sui-core developers
// and not for CampMinder theme.
const disclaimerText = 'Disclaimer'
const disclaimerBodyOne = 'The preset theming options below are not packaged in sui-core out of the box.'
const disclaimerBodyTwo = 'For both white labelling and sui-themes, projects are still responsible for choosing the colours for each CSS variable.'
const disclaimerBodySuiThemesUsage = 'For sui-themes package usage:'
const disclaimerBodySuiThemesUsageItemOne = 'Only Multi-Property, Little Hotelier and Platform Pay should be using sui-themes package for theming purposes.'
const disclaimerBodySuiThemesUsageItemTwo = 'Only the existing CSS variables being actively used by these three projects will be ported over.'
// #endregion theming

// #region language
const languageLabels = ref({
  [Language.EN]: t('english-language-radio-option-label'),
  [Language.DE]: t('german-language-radio-option-label'),
  [Language.TH]: t('thai-language-radio-option-label'),
})
watch(language, async (newValue) => {
  await loadLanguageAsync(newValue)

  // need to re-assign the languageLabels object to update the translations
  languageLabels.value = {
    [Language.EN]: t('english-language-radio-option-label'),
    [Language.DE]: t('german-language-radio-option-label'),
    [Language.TH]: t('thai-language-radio-option-label'),
  }

  whiteLabelColourLabels.value = {
    [WhiteLabelColour.BLUE]: t('blue-theme-radio-option-label'),
    [WhiteLabelColour.RED]: t('red-theme-radio-option-label'),
    [WhiteLabelColour.GREEN]: t('green-theme-radio-option-label'),
    [WhiteLabelColour.SLATE]: t('slate-theme-radio-option-label'),
  }
})
// #endregion
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title :title="t('page-title')" />
      <sm-form>
        <sm-form-group :legend="t('content-form-group-label')">
          <sm-radio-group
            :label="t('select-language-radio-group-label')"
            name="language"
          >
            <sm-radio
              v-model="selectedLanguage"
              name="language"
              :label="languageLabels[Language.EN]"
              :selected-value="Language.EN"
              :error-disabled="true"
            />
            <sm-radio
              v-model="selectedLanguage"
              name="language"
              :label="languageLabels[Language.DE]"
              :selected-value="Language.DE"
              :error-disabled="true"
            />
            <sm-radio
              v-model="selectedLanguage"
              name="language"
              :label="languageLabels[Language.TH]"
              :selected-value="Language.TH"
              :error-disabled="true"
            />
          </sm-radio-group>
        </sm-form-group>

        <br>

        <sm-form-group :legend="t('theme-form-group-label')">
          <sm-help-card type="alert">
            <template #header>{{ disclaimerText }}</template>
            <template #body>
              {{ disclaimerBodyOne }}
              <br>
              {{ disclaimerBodyTwo }}
              <br><br>
              {{ disclaimerBodySuiThemesUsage }}
              <ul>
                <li>{{ disclaimerBodySuiThemesUsageItemOne }}</li>
                <li>{{ disclaimerBodySuiThemesUsageItemTwo }}</li>
              </ul>
            </template>
          </sm-help-card>

          <br>

          <sm-radio-group
            :label="t('select-white-label-radio-group-label')"
            name="white-label"
          >
            <sm-radio
              v-model="selectedWhiteLabel"
              name="white-label"
              :label="whiteLabelColourLabels[WhiteLabelColour.RED]"
              :selected-value="WhiteLabelColour.RED"
              :error-disabled="true"
              :disabled="!isWhiteLabelModeEnabled"
            />
            <sm-radio
              v-model="selectedWhiteLabel"
              name="white-label"
              :label="whiteLabelColourLabels[WhiteLabelColour.GREEN]"
              :selected-value="WhiteLabelColour.GREEN"
              :error-disabled="true"
              :disabled="!isWhiteLabelModeEnabled"
            />
            <sm-radio
              v-model="selectedWhiteLabel"
              name="white-label"
              :label="whiteLabelColourLabels[WhiteLabelColour.BLUE]"
              :selected-value="WhiteLabelColour.BLUE"
              :error-disabled="true"
              :disabled="!isWhiteLabelModeEnabled"
            />
            <sm-radio
              v-model="selectedWhiteLabel"
              name="white-label"
              :label="whiteLabelColourLabels[WhiteLabelColour.SLATE]"
              :selected-value="WhiteLabelColour.SLATE"
              :error-disabled="true"
              :disabled="!isWhiteLabelModeEnabled"
            />
          </sm-radio-group>

          <sm-radio-group
            :label="t('select-product-theme-radio-group-label')"
            name="sui-themes"
          >
            <sm-radio
              v-model="suiTheme"
              name="sui-themes"
              :label="suiThemeLabels[SuiThemeProduct.LITTLE_HOTELIER]"
              :selected-value="SuiThemeProduct.LITTLE_HOTELIER"
              :error-disabled="true"
              :disabled="!!themeMode"
            />
            <sm-radio
              v-model="suiTheme"
              name="sui-themes"
              :label="suiThemeLabels[SuiThemeProduct.MULTI_PROPERTY]"
              :selected-value="SuiThemeProduct.MULTI_PROPERTY"
              :error-disabled="true"
              :disabled="!!themeMode"
            />
            <sm-radio
              v-model="suiTheme"
              name="sui-themes"
              :label="suiThemeLabels[SuiThemeProduct.PLATFORM_PAY]"
              :selected-value="SuiThemeProduct.PLATFORM_PAY"
              :error-disabled="true"
              :disabled="!!themeMode"
            />
          </sm-radio-group>

          <sm-radio-group
            :label="t('select-product-sui-core-theme-radio-group-label')"
            name="sui-core-themes"
          >
            <sm-radio
              v-model="suiCoreTheme"
              name="sui-core-themes"
              :label="suiCoreThemeLabels[SuiCoreThemeProduct.NONE]"
              :selected-value="SuiCoreThemeProduct.NONE"
              :error-disabled="true"
            />
            <sm-radio
              v-model="suiCoreTheme"
              name="sui-core-themes"
              :label="suiCoreThemeLabels[SuiCoreThemeProduct.CAMPMINDER]"
              :selected-value="SuiCoreThemeProduct.CAMPMINDER"
              :error-disabled="true"
            />
          </sm-radio-group>
        </sm-form-group>
      </sm-form>
    </sm-container>
  </sm-section>
</template>
