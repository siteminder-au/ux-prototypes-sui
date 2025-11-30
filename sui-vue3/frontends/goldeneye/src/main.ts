import 'normalize.css'

import { createApp, configureCompat } from 'vue'

import SuiIcons from '@siteminder/sui-icons'
import { ApolloClients } from '@vue/apollo-composable'

// all 120+ base components
// import SuiCore from '@siteminder/sui-core'

// #region tree shake example: Install per component with global registration
import { Sm404Page } from '@siteminder/sui-core/components/sm-404-page'
import { SmAccordion, SmAccordionGraphic } from '@siteminder/sui-core/components/sm-accordion'
import { SmAppHeader, SmAppHeaderLink } from '@siteminder/sui-core/components/sm-app-header'
import { SmAside } from '@siteminder/sui-core/components/sm-aside'
import { SmBadge } from '@siteminder/sui-core/components/sm-badge'
import { SmBanner } from '@siteminder/sui-core/components/sm-banner'
import { SmBreadcrumbs, SmBreadcrumbItem } from '@siteminder/sui-core/components/sm-breadcrumbs'
import { SmButton } from '@siteminder/sui-core/components/sm-button'
import { SmCalendar } from '@siteminder/sui-core/components/forms/sm-calendar'
import { SmCard, SmCardGraphic, SmCardActions, SmCardBrandGraphic, SmCardContent, SmCardFooter } from '@siteminder/sui-core/components/sm-card'
import { SmCarousel } from '@siteminder/sui-core/components/sm-carousel'
import { SmCheckbox, SmCheckboxButton, SmCheckboxGroup } from '@siteminder/sui-core/components/forms/sm-checkbox'
import { SmColorPicker } from '@siteminder/sui-core/components/sm-color-picker'
import { SmContainer } from '@siteminder/sui-core/components/sm-container'
import { SmContentSlider, SmContentSliderItem, SmContentSliderGraphic } from '@siteminder/sui-core/components/sm-content-slider'
import { SmController } from '@siteminder/sui-core/components/sm-controller'
import { SmDatePicker } from '@siteminder/sui-core/components/forms/sm-date-picker'
import { SmDialog } from '@siteminder/sui-core/components/sm-dialog'
import { SmDivider } from '@siteminder/sui-core/components/sm-divider'
import { SmDrawer } from '@siteminder/sui-core/components/sm-drawer'
import { SmDropdown } from '@siteminder/sui-core/components/sm-dropdown'
import { SmExpandableCard, SmExpandableCardBody } from '@siteminder/sui-core/components/sm-expandable-card'
import { SmForm } from '@siteminder/sui-core/components/forms/sm-form'
import { SmFormGroup } from '@siteminder/sui-core/components/forms/sm-form-group'
import { SmHelpCard } from '@siteminder/sui-core/components/sm-help-card'
import { SmHorizontalNav, SmHorizontalNavItem } from '@siteminder/sui-core/components/sm-horizontal-nav'
import { SmHtmlTruncator } from '@siteminder/sui-core/components/sm-html-truncator'
import { SmInlineCard } from '@siteminder/sui-core/components/sm-inline-card'
import { SmInput, SmInputPrefixContent, SmInputSuffixButton, SmInputSuffixContent } from '@siteminder/sui-core/components/forms/sm-input'
import { SmLazyImage } from '@siteminder/sui-core/components/sm-lazy-image'
import { SmList, SmListItem } from '@siteminder/sui-core/components/sm-list'
import { SmLoader } from '@siteminder/sui-core/components/loading/sm-loader'
import { SmLoadingCard } from '@siteminder/sui-core/components/loading/sm-loading-card'
import { SmLoadingDashboard, SmLoadingLongCard, SmLoadingSmallCard, SmLoadingGraphCard } from '@siteminder/sui-core/components/loading/sm-loading-dashboard'
import { SmLoadingForm } from '@siteminder/sui-core/components/loading/sm-loading-form'
import { SmLoadingHomeScreen } from '@siteminder/sui-core/components/loading/sm-loading-home-screen'
import { SmLoadingImage } from '@siteminder/sui-core/components/loading/sm-loading-image'
import { SmLoadingList } from '@siteminder/sui-core/components/loading/sm-loading-list'
import { SmLoadingTable } from '@siteminder/sui-core/components/loading/sm-loading-table'
import { SmLoadingSpinner } from '@siteminder/sui-core/components/loading/sm-loading-spinner'
import { SmMedia, SmMediaItem } from '@siteminder/sui-core/components/sm-media'
import { SmMultiSelect } from '@siteminder/sui-core/components/forms/sm-multi-select'
import { SmNav, SmNavItem } from '@siteminder/sui-core/components/sm-nav'
import { SmPageTitle } from '@siteminder/sui-core/components/sm-page-title'
import { SmPagination } from '@siteminder/sui-core/components/sm-pagination'
import { SmPopover } from '@siteminder/sui-core/components/sm-popover'
import { SmProgressBar } from '@siteminder/sui-core/components/sm-progress-bar'
import { SmPropertyMenu } from '@siteminder/sui-core/components/sm-property-menu'
import { SmRadio, SmRadioButton, SmRadioGroup } from '@siteminder/sui-core/components/forms/sm-radio'
import { SmSection } from '@siteminder/sui-core/components/sm-section'
import { SmSelect, SmSelectPrefixContent, SmSelectSuffixContent } from '@siteminder/sui-core/components/forms/sm-select'
import { SmSlider } from '@siteminder/sui-core/components/sm-slider'
import { SmSwitch, SmSwitchGroup } from '@siteminder/sui-core/components/forms/sm-switch'
import { SmTranslationsInput } from '@siteminder/sui-core/components/forms/sm-translations-input'
import { SmTable, SmTableTh, SmTableTr, SmTableThead, SmTableTd, SmTableTbody, SmTableTfoot } from '@siteminder/sui-core/components/sm-table'
import { SmTabs, SmTab } from '@siteminder/sui-core/components/sm-tabs'
import { SmTag } from '@siteminder/sui-core/components/sm-tag'
import { SmTextTruncator } from '@siteminder/sui-core/components/sm-text-truncator'
import { SmToast } from '@siteminder/sui-core/components/sm-toast'
import { SmTooltip } from '@siteminder/sui-core/components/sm-tooltip'
import { SmTimePicker } from '@siteminder/sui-core/components/forms/sm-time-picker'
import { SmUserList, SmUserListItem } from '@siteminder/sui-core/components/sm-user-list'
import { SmUserMenu } from '@siteminder/sui-core/components/sm-user-menu'
import { SmVerticalNav, SmVerticalNavItem, SmVerticalNavSection } from '@siteminder/sui-core/components/sm-vertical-nav'
import { SmWizard, SmWizardStep } from '@siteminder/sui-core/components/sm-wizard'
import { setupVeeValidate, setupVueI18n } from '@siteminder/sui-core/libs'
// #endregion

import App from '@/app.vue'
import { router } from '@/router'

import { i18n } from '@/services/i18n'
import { createVueApolloProvider } from './services/gql'

// See https://v3-migration.vuejs.org/migration-build.html#per-component-config
// disable compat for certain features
// NOTE: configureCompat() must occur before we create our vue app instance
// to ensure that the settings are applied correctly.
configureCompat({
  // Needed by sm-date-picker's dateTime and time modes
  // It has a dependency on v-calendar which has a subcomponent that is not configured for migration/compat build.
  // This can probably be fixed by https://github.com/nathanreyes/v-calendar/pull/1149
  // However, enabling this in the consuming app means you'll have to look into https://v3-migration.vuejs.org/breaking-changes/v-model.html
  COMPONENT_V_MODEL: false,
  // Same as above, but this started happening after upgrading the campminder FE
  // (compat build) from v3.4.19 to v3.4.38
  ATTR_FALSE_VALUE: false,
})

const app = createApp(App)

app.use(i18n)
app.use(router)
// for now we use the full install approach as that is what all downstream projects are doing right now.
// so all our cypress tests are regression testing against this installation approach
// all 120+ base components
// app.use(SuiCore, { i18n })
app.use(SuiIcons)

// #region tree shake example: Install per component with global registration
// NOTE: make sure you call setupVueI18n before setupVeeValidate!
setupVueI18n(i18n)
setupVeeValidate()

// override the registration of these components from the full install above
// and register the newer vue3 compliant components individually.
// #region forms
app.component('sm-calendar', SmCalendar)
app.component('sm-checkbox', SmCheckbox)
app.component('sm-checkbox-button', SmCheckboxButton)
app.component('sm-checkbox-group', SmCheckboxGroup)
app.component('sm-date-picker', SmDatePicker)
app.component('sm-form', SmForm)
app.component('sm-form-group', SmFormGroup)
app.component('sm-input', SmInput)
app.component('sm-input-prefix-content', SmInputPrefixContent)
app.component('sm-input-suffix-button', SmInputSuffixButton)
app.component('sm-input-suffix-content', SmInputSuffixContent)
app.component('sm-radio', SmRadio)
app.component('sm-radio-button', SmRadioButton)
app.component('sm-radio-group', SmRadioGroup)
app.component('sm-select', SmSelect)
app.component('sm-select-prefix-content', SmSelectPrefixContent)
app.component('sm-select-suffix-content', SmSelectSuffixContent)
app.component('sm-switch', SmSwitch)
app.component('sm-switch-group', SmSwitchGroup)
app.component('sm-time-picker', SmTimePicker)
app.component('sm-translations-input', SmTranslationsInput)
// #endregion
// #region loading
app.component('sm-loader', SmLoader)
app.component('sm-loading-card', SmLoadingCard)
app.component('sm-loading-dashboard', SmLoadingDashboard)
app.component('sm-loading-form', SmLoadingForm)
app.component('sm-loading-graph-card', SmLoadingGraphCard)
app.component('sm-loading-home-screen', SmLoadingHomeScreen)
app.component('sm-loading-image', SmLoadingImage)
app.component('sm-loading-list', SmLoadingList)
app.component('sm-loading-long-card', SmLoadingLongCard)
app.component('sm-loading-small-card', SmLoadingSmallCard)
app.component('sm-loading-table', SmLoadingTable)
app.component('sm-loading-spinner', SmLoadingSpinner)
// #endregion
app.component('sm-404-page', Sm404Page)
app.component('sm-accordion', SmAccordion)
app.component('sm-accordion-graphic', SmAccordionGraphic)
app.component('sm-app-header', SmAppHeader)
app.component('sm-app-header-link', SmAppHeaderLink)
app.component('sm-aside', SmAside)
app.component('sm-badge', SmBadge)
app.component('sm-banner', SmBanner)
app.component('sm-breadcrumb-item', SmBreadcrumbItem)
app.component('sm-breadcrumbs', SmBreadcrumbs)
app.component('sm-button', SmButton)
app.component('sm-card', SmCard)
app.component('sm-card-actions', SmCardActions)
app.component('sm-card-brand-graphic', SmCardBrandGraphic)
app.component('sm-card-content', SmCardContent)
app.component('sm-card-footer', SmCardFooter)
app.component('sm-card-graphic', SmCardGraphic)
app.component('sm-carousel', SmCarousel)
app.component('sm-color-picker', SmColorPicker)
app.component('sm-container', SmContainer)
app.component('sm-content-slider', SmContentSlider)
app.component('sm-content-slider-item', SmContentSliderItem)
app.component('sm-content-slider-graphic', SmContentSliderGraphic)
app.component('sm-controller', SmController)
app.component('sm-dialog', SmDialog)
app.component('sm-divider', SmDivider)
app.component('sm-drawer', SmDrawer)
app.component('sm-dropdown', SmDropdown)
app.component('sm-expandable-card', SmExpandableCard)
app.component('sm-expandable-card-body', SmExpandableCardBody)
app.component('sm-help-card', SmHelpCard)
app.component('sm-horizontal-nav', SmHorizontalNav)
app.component('sm-horizontal-nav-item', SmHorizontalNavItem)
app.component('sm-html-truncator', SmHtmlTruncator)
app.component('sm-inline-card', SmInlineCard)
app.component('sm-lazy-image', SmLazyImage)
app.component('sm-list', SmList)
app.component('sm-list-item', SmListItem)
app.component('sm-media', SmMedia)
app.component('sm-media-item', SmMediaItem)
app.component('sm-multi-select', SmMultiSelect)
app.component('sm-nav', SmNav)
app.component('sm-nav-item', SmNavItem)
app.component('sm-page-title', SmPageTitle)
app.component('sm-pagination', SmPagination)
app.component('sm-popover', SmPopover)
app.component('sm-progress-bar', SmProgressBar)
app.component('sm-property-menu', SmPropertyMenu)
app.component('sm-section', SmSection)
app.component('sm-slider', SmSlider)
app.component('sm-tab', SmTab)
app.component('sm-table', SmTable)
app.component('sm-table-tbody', SmTableTbody)
app.component('sm-table-td', SmTableTd)
app.component('sm-table-tfoot', SmTableTfoot)
app.component('sm-table-th', SmTableTh)
app.component('sm-table-thead', SmTableThead)
app.component('sm-table-tr', SmTableTr)
app.component('sm-tabs', SmTabs)
app.component('sm-tag', SmTag)
app.component('sm-text-truncator', SmTextTruncator)
app.component('sm-toast', SmToast)
app.component('sm-tooltip', SmTooltip)
app.component('sm-user-list', SmUserList)
app.component('sm-user-list-item', SmUserListItem)
app.component('sm-user-menu', SmUserMenu)
app.component('sm-vertical-nav', SmVerticalNav)
app.component('sm-vertical-nav-item', SmVerticalNavItem)
app.component('sm-vertical-nav-section', SmVerticalNavSection)
app.component('sm-wizard', SmWizard)
app.component('sm-wizard-step', SmWizardStep)
// #endregion

// #Region Setup apollo client
const apolloProvider = createVueApolloProvider()
app.provide(ApolloClients, apolloProvider)
// #endregion

app.mount('#app')

// Vue.use(SuiCore, { i18n })
// Vue.use(SuiIcons)

// directives
// v-focus automatically focuses on the DOM element
// suitable for input field elements
// Vue.directive('focus', {
//   inserted: (el) => {
//     const input = el.querySelector('input')
//     if (input) {
//       input.focus()
//     }
//   },
// })
// v-select automatically selects all the characters on the DOM element
// suitable for input field elements
// Vue.directive('select', {
//   inserted: (el) => {
//     const input = el.querySelector('input')
//     if (input) {
//       input.select()
//     }
//   },
// })

// Vue.config.productionTip = false
// Vue.config.errorHandler = (err: Error): void => {
//   console.error('error handler', err)
// }

// if (config.VUE_DEVTOOLS) {
//   Vue.config.devtools = config.VUE_DEVTOOLS
// }

// new Vue({
//   router,
//   i18n,
//   render: h => h(App),
// }).$mount('#app')
