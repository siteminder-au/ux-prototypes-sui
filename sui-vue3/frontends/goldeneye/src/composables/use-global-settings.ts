import { computed, Ref, ref } from 'vue'

export enum Language {
  DE = 'de',
  EN = 'en',
  TH = 'th',
}
export const selectedLanguage = ref(Language.EN)

export enum WhiteLabelColour {
  BLUE = 'blue',
  GREEN = 'green',
  RED = 'red',
  SLATE = 'slate',
}
export const selectedWhiteLabel = ref(WhiteLabelColour.BLUE)

// represents if we want the webapp to use sui-themes package
// and our css variable overrides in src/assets/styles/sui-themes.css
export enum SuiThemeProduct {
  LITTLE_HOTELIER = 'little-hotelier',
  MULTI_PROPERTY = 'multi-property',
  PLATFORM_PAY = 'platform-pay',
}
export const selectedSuiThemeProduct = ref(null)
// export const useSuiTheme = ref(false)

export enum SuiCoreThemeProduct {
  CAMPMINDER = 'campminder',
  NONE = 'none',
}
export const selectedSuiCoreThemeProduct = ref(SuiCoreThemeProduct.NONE)

export enum ThemeMode {
  SUI_CORE_THEMES = 'sui-core-themes',
  SUI_THEMES = 'sui-themes',
  WHITE_LABEL = 'white-label',
}
export const themeMode = ref<ThemeMode | null>(null)

// we should not have *both* white-labelling and sui-themes imported together
// as their css specificities override each other in unexpected ways.
// white-label mode is allowed when sui-themes is not enabled
const isWhiteLabelModeEnabled = computed(() => themeMode.value !== ThemeMode.SUI_THEMES)

export const useGlobalSettings = (): {
  language: Ref<Language>
  whiteLabel: Ref<WhiteLabelColour>
  suiTheme: Ref<SuiThemeProduct | null>
  suiCoreTheme: Ref<SuiCoreThemeProduct | null>
  isWhiteLabelModeEnabled: Ref<boolean>
} => ({
  language: selectedLanguage,
  whiteLabel: selectedWhiteLabel,
  suiTheme: selectedSuiThemeProduct,
  suiCoreTheme: selectedSuiCoreThemeProduct,
  isWhiteLabelModeEnabled,
})
