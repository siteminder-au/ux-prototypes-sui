import 'normalize.css'
import './assets/styles/styles.css'

import Vue from 'vue'

import SuiIcons from '@siteminder/sui-icons'
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
import { SmInput, SmInputPrefixContent, SmInputSuffixContent } from '@siteminder/sui-core/components/forms/sm-input'
import { SmLazyImage } from '@siteminder/sui-core/components/sm-lazy-image'
import { SmList, SmListItem } from '@siteminder/sui-core/components/sm-list'
import { SmLoader } from '@siteminder/sui-core/components/loading/sm-loader'
import { SmLoadingBar } from '@siteminder/sui-core/components/loading/sm-loading-bar'
import { SmLoadingCard } from '@siteminder/sui-core/components/loading/sm-loading-card'
import { SmLoadingDashboard, SmLoadingLongCard, SmLoadingSmallCard, SmLoadingGraphCard } from '@siteminder/sui-core/components/loading/sm-loading-dashboard'
import { SmLoadingForm } from '@siteminder/sui-core/components/loading/sm-loading-form'
import { SmLoadingHomeScreen } from '@siteminder/sui-core/components/loading/sm-loading-home-screen'
import { SmLoadingImage } from '@siteminder/sui-core/components/loading/sm-loading-image'
import { SmLoadingList } from '@siteminder/sui-core/components/loading/sm-loading-list'
import { SmLoadingTable } from '@siteminder/sui-core/components/loading/sm-loading-table'
import { SmMedia, SmMediaItem } from '@siteminder/sui-core/components/sm-media2'
import { SmMultiSelect } from '@siteminder/sui-core/components/forms/sm-multi-select'
import { SmNav, SmNavItem } from '@siteminder/sui-core/components/sm-nav2'
import { SmPageTitle } from '@siteminder/sui-core/components/sm-page-title'
import { SmPagination } from '@siteminder/sui-core/components/sm-pagination'
import { SmPopover } from '@siteminder/sui-core/components/sm-popover'
import { SmProgressBar } from '@siteminder/sui-core/components/sm-progress-bar'
import { SmPropertyMenu } from '@siteminder/sui-core/components/sm-property-menu'
import { SmRadio, SmRadioButton, SmRadioGroup } from '@siteminder/sui-core/components/forms/sm-radio'
import { SmSection } from '@siteminder/sui-core/components/sm-section'
import { SmSelect, SmSelectPrefixContent, SmSelectSuffixContent } from '@siteminder/sui-core/components/forms/sm-select'
import { SmTranslationsInput } from '@siteminder/sui-core/components/forms/sm-translations-input'
import { SmSlider } from '@siteminder/sui-core/components/sm-slider'
import { SmSwitch, SmSwitchGroup } from '@siteminder/sui-core/components/forms/sm-switch'
import { SmTable, SmTableTh, SmTableTr, SmTableThead, SmTableTd, SmTableTbody, SmTableTfoot } from '@siteminder/sui-core/components/sm-table'
import { SmTabs, SmTab } from '@siteminder/sui-core/components/sm-tabs'
import { SmTag } from '@siteminder/sui-core/components/sm-tag'
import { SmTextTruncator } from '@siteminder/sui-core/components/sm-text-truncator'
import { SmToast } from '@siteminder/sui-core/components/sm-toast'
import { SmTooltip } from '@siteminder/sui-core/components/sm-tooltip2'
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

import config from '@/config'

// for now we use the full install approach as that is what all downstream projects are doing right now.
// so all our cypress tests are regression testing against this installation approach
// all 120+ base components
// Vue.use(SuiCore, { i18n })

// #region tree shake example: Install per component with global registration
// NOTE: make sure you call setupVueI18n before setupVeeValidate!
setupVueI18n(i18n)
setupVeeValidate()

// override the registration of these components from the full install above
// and register the newer vue3 compliant components individually.
// #region forms
Vue.component('SmCalendar', SmCalendar)
Vue.component('SmCheckbox', SmCheckbox)
Vue.component('SmCheckboxButton', SmCheckboxButton)
Vue.component('SmCheckboxGroup', SmCheckboxGroup)
Vue.component('SmDatePicker', SmDatePicker)
Vue.component('SmForm', SmForm)
Vue.component('SmFormGroup', SmFormGroup)
Vue.component('SmInput', SmInput)
Vue.component('SmInputPrefixContent', SmInputPrefixContent)
Vue.component('SmInputSuffixContent', SmInputSuffixContent)
Vue.component('SmRadio', SmRadio)
Vue.component('SmRadioButton', SmRadioButton)
Vue.component('SmRadioGroup', SmRadioGroup)
Vue.component('SmSelect', SmSelect)
Vue.component('SmSelectPrefixContent', SmSelectPrefixContent)
Vue.component('SmSelectSuffixContent', SmSelectSuffixContent)
Vue.component('SmSwitch', SmSwitch)
Vue.component('SmSwitchGroup', SmSwitchGroup)
Vue.component('SmTimePicker', SmTimePicker)
Vue.component('SmTranslationsInput', SmTranslationsInput)
// #endregion
// #region loading
Vue.component('SmLoader', SmLoader)
Vue.component('SmLoadingBar', SmLoadingBar)
Vue.component('SmLoadingCard', SmLoadingCard)
Vue.component('SmLoadingDashboard', SmLoadingDashboard)
Vue.component('SmLoadingForm', SmLoadingForm)
Vue.component('SmLoadingGraphCard', SmLoadingGraphCard)
Vue.component('SmLoadingHomeScreen', SmLoadingHomeScreen)
Vue.component('SmLoadingImage', SmLoadingImage)
Vue.component('SmLoadingList', SmLoadingList)
Vue.component('SmLoadingLongCard', SmLoadingLongCard)
Vue.component('SmLoadingSmallCard', SmLoadingSmallCard)
Vue.component('SmLoadingTable', SmLoadingTable)
// #endregion
Vue.component('Sm404Page', Sm404Page)
Vue.component('SmAccordion', SmAccordion)
Vue.component('SmAccordionGraphic', SmAccordionGraphic)
Vue.component('SmAppHeader', SmAppHeader)
Vue.component('SmAppHeaderLink', SmAppHeaderLink)
Vue.component('SmAside', SmAside)
Vue.component('SmBadge', SmBadge)
Vue.component('SmBanner', SmBanner)
Vue.component('SmBreadcrumbItem', SmBreadcrumbItem)
Vue.component('SmBreadcrumbs', SmBreadcrumbs)
Vue.component('SmButton', SmButton)
Vue.component('SmCard', SmCard)
Vue.component('SmCardActions', SmCardActions)
Vue.component('SmCardBrandGraphic', SmCardBrandGraphic)
Vue.component('SmCardContent', SmCardContent)
Vue.component('SmCardFooter', SmCardFooter)
Vue.component('SmCardGraphic', SmCardGraphic)
Vue.component('SmCarousel', SmCarousel)
Vue.component('SmColorPicker', SmColorPicker)
Vue.component('SmContainer', SmContainer)
Vue.component('SmContentSlider', SmContentSlider)
Vue.component('SmContentSliderItem', SmContentSliderItem)
Vue.component('SmContentSliderGraphic', SmContentSliderGraphic)
Vue.component('SmController', SmController)
Vue.component('SmDialog', SmDialog)
Vue.component('SmDivider', SmDivider)
Vue.component('SmDrawer', SmDrawer)
Vue.component('SmDropdown', SmDropdown)
Vue.component('SmExpandableCard', SmExpandableCard)
Vue.component('SmExpandableCardBody', SmExpandableCardBody)
Vue.component('SmHelpCard', SmHelpCard)
Vue.component('SmHorizontalNav', SmHorizontalNav)
Vue.component('SmHorizontalNavItem', SmHorizontalNavItem)
Vue.component('SmHtmlTruncator', SmHtmlTruncator)
Vue.component('SmInlineCard', SmInlineCard)
Vue.component('SmLazyImage', SmLazyImage)
Vue.component('SmList', SmList)
Vue.component('SmListItem', SmListItem)
Vue.component('SmMedia', SmMedia)
Vue.component('SmMediaItem', SmMediaItem)
Vue.component('SmMultiSelect', SmMultiSelect)
Vue.component('SmNav', SmNav)
Vue.component('SmNavItem', SmNavItem)
Vue.component('SmPageTitle', SmPageTitle)
Vue.component('SmPagination', SmPagination)
Vue.component('SmPopover', SmPopover)
Vue.component('SmProgressBar', SmProgressBar)
Vue.component('SmPropertyMenu', SmPropertyMenu)
Vue.component('SmSection', SmSection)
Vue.component('SmSlider', SmSlider)
Vue.component('SmTab', SmTab)
Vue.component('SmTable', SmTable)
Vue.component('SmTableTbody', SmTableTbody)
Vue.component('SmTableTd', SmTableTd)
Vue.component('SmTableTfoot', SmTableTfoot)
Vue.component('SmTableTh', SmTableTh)
Vue.component('SmTableThead', SmTableThead)
Vue.component('SmTableTr', SmTableTr)
Vue.component('SmTabs', SmTabs)
Vue.component('SmTag', SmTag)
Vue.component('SmTextTruncator', SmTextTruncator)
Vue.component('SmToast', SmToast)
Vue.component('SmTooltip', SmTooltip)
Vue.component('SmUserList', SmUserList)
Vue.component('SmUserListItem', SmUserListItem)
Vue.component('SmUserMenu', SmUserMenu)
Vue.component('SmVerticalNav', SmVerticalNav)
Vue.component('SmVerticalNavItem', SmVerticalNavItem)
Vue.component('SmVerticalNavSection', SmVerticalNavSection)
Vue.component('SmWizard', SmWizard)
Vue.component('SmWizardStep', SmWizardStep)
// #endregion

Vue.use(SuiIcons)

// directives
// v-focus automatically focuses on the DOM element
// suitable for input field elements
Vue.directive('focus', {
  inserted: (el) => {
    const input = el.querySelector('input')
    if (input) {
      input.focus()
    }
  },
})
// v-select automatically selects all the characters on the DOM element
// suitable for input field elements
Vue.directive('select', {
  inserted: (el) => {
    const input = el.querySelector('input')
    if (input) {
      input.select()
    }
  },
})

Vue.config.productionTip = false
Vue.config.errorHandler = (err: Error): void => {
  console.error('error handler', err)
}

if (config.VUE_DEVTOOLS) {
  Vue.config.devtools = config.VUE_DEVTOOLS
}

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
