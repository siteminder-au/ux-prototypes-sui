# Changelog
All notable changes to the vue2 build will be documented in this file.

To see vue3 build CHANGELOG, see CHANGELOG.vue3.md instead.

## sui-core@9.1.0
##### Minors & Patches
- SUI-2128: (sm-select) Trigger validation on blur [#1131](https://github.com/siteminder-au/sui/pull/1131)
- SUI-2202: (sm-translations-input, sm-text-truncator) Added missing localization key [#1168](https://github.com/siteminder-au/sui/pull/1168)
- SUI-2202: (sm-loader) Added missing translation for sm-loader in other 6 languages files, Also, Updated and replaced all translation file to keep in sync with sui-sui-core-en.json `en` file [#1168](https://github.com/siteminder-au/sui/pull/1168)

## sui-core@9.0.0
##### Breaking changes
- SUI-1916: (sm-loading-form) Remove Tailwind classes from the component [#1076](https://github.com/siteminder-au/sui/pull/1076)

##### Minors & Patches
- SUI-2096: (internal) Upgrade Vue 2.7.14 to 2.7.16 [#1061](https://github.com/siteminder-au/sui/pull/1061)

## sui-core@8.3.2
##### Minors & Patches
- SUI-2093: (sm-carousel) ensure carousel is reactive to changes from data array prop [#1043](https://github.com/siteminder-au/sui/pull/1043)
- SUI-2042: (sm-button) remove double focus style on sm-button. [#997](https://github.com/siteminder-au/sui/pull/997)
##### Internal
- SUI-1849, SUI-1850, SUI-1851: (sm-form) Sync sm-form stories with vue3 [#953](https://github.com/siteminder-au/sui/pull/953)
- SUI-1996: (sm-form) fix invalid form submission test [#974](https://github.com/siteminder-au/sui/pull/974)
- SUI-2034: (sm-date-picker) update stories to cover more cases [#976](https://github.com/siteminder-au/sui/pull/976)

## sui-core@8.3.1
##### Minors & Patches
- SUI-1853: [vee-validate, sm-input] Test and update all props and storybook examples accordingly (master) [#914](https://github.com/siteminder-au/sui/pull/914)

## sui-core@8.3.0
##### Minors & Patches
- SUI-1635: (sm-nav, sm-nav-item) create new sm-nav and sm-nav-item [#869](https://github.com/siteminder-au/sui/pull/869)
  - Downstream projects should move from sm-nav to sm-nav2, sm-nav-item to sm-nav-item2 before the vue3 upgrade
  - Downstream projects should audit usages of `sm-nav/sm-nav-item` and its props, variables and functions. For example, checking for added and deprecated props. Check storybook for updated examples.
  - Recommended to change vue component registration of `sm-nav-items` to `sm-nav-item` (see example below)
  - Deprecated props `visibleLevelOne` and `visibleLevelTwo` in the latest version `sm-nav2`
  ```ts
  // src/main.ts
  import SuiCore from '@siteminder/sui-core'
  import { SmNav, SmNavItem } from '@siteminder/sui-core/components/sm-nav2'
  
  // if installing all 120+ components
  Vue.use(SuiCore, { i18n })
  
  // register the new nav under a different name (e.g. sm-nav2) if you did using a full install of sui-core
  // this is to avoid conflicts with the old sm-nav registration which will be using `sm-nav` name
  Vue.component('sm-nav2', SmNav)
  Vue.component('sm-nav-item', SmNavItem)
  ```
- SUI-1915: (sm-tooltip) add missing classname renames to ensure the right styles applied for tooltip types for sm-tooltip2

##### Internal
- SUI-1606: Remove vtlMocks and stubbed sm-icon from individual tests [#889](https://github.com/siteminder-au/sui/pull/889)

## sui-core@8.2.1
##### Minors & Patches
- SUI-1915: (sm-tooltip) update sm-tooltip2 parent classname to avoid style bleeding with existing sm-tooltip

## sui-core@8.2.0
##### Minors & Patches
- SUI-1635: (sm-media, sm-media-item) create new sm-media and sm-media-item [#837](https://github.com/siteminder-au/sui/pull/837)
  - Downstream projects should move from sm-media to sm-media2, sm-media-item to sm-media-item2 before the vue3 upgrade
  - The new sm-media has also dropped several features and props to minimise code complexity:
    - sm-media
      - Deprecated props: gridItemHeight, isSelectable, multipleSelections.
      - Removed private variables/functions: mediaItems, resetSelections.
    - sm-media-item
      - Introduced props: isSelectable, gridItemWidth, gridItemHeight.
      - Removed private variables/functions: itemWidth, itemHeight, resetSelection.
  - Downstream projects should audit usages of `sm-media/sm-media-item` and remove any references of the above props, variables and functions
  ```ts
  // src/main.ts
  import SuiCore from '@siteminder/sui-core'
  import { SmMedia, SmMediaItem } from '@siteminder/sui-core/components/sm-media2'
  
  // if installing all 120+ components
  Vue.use(SuiCore, { i18n })
  
  // register the new media under a different name (e.g. sm-media2) if you did using a full install of sui-core
  // this is to avoid conflicts with the old sm-media registration which will be using `sm-media` name
  Vue.component('sm-media2', SmMedia)
  Vue.component('sm-media-item2', SmMediaItem)
  ```

##### Internal
- SUI-1823: (internal) remove deprecated `objectHashIgnoreUnknownHack` prop in vite.config.js. see reference [link](https://github.com/egoist/bili/issues/305). [#849](https://github.com/siteminder-au/sui/pull/849)
- SUI-1768: (internal) bump vue-tsc to latest. ensure clean.sh script is run before extra-checks step runs to avoid ts issue (see: reference [link](https://github.com/microsoft/TypeScript/issues/54057))

## sui-core@8.1.0
##### Minors & Patches
- SUI-1689: (sm-dialog) inline sui icons [#820](https://github.com/siteminder-au/sui/pull/820)
- SUI-1740: (global) Rename sui-core.css to sui-core.scss [#832](https://github.com/siteminder-au/sui/pull/832)
##### Internal
- SUI-1560: (sm-date-picker) Update unit test to cover first day of the month and add more demos to Storybook [#835](https://github.com/siteminder-au/sui/pull/835)

## sui-core@8.0.0
##### Breaking changes
- SUI-1271 enable tree shaking [#775](https://github.com/siteminder-au/sui/pull/775)
  - Downstream projects now have the ability to import only the components they need in their webapp!
  ```ts
  // --- BEFORE ---
  // src/main.ts
  import { i18n } from '@/services/i18n'
  import SuiIcons from '@siteminder/sui-icons'
  import SuiCore from '@siteminder/sui-core'
  
  Vue.use(SuiCore, { i18n })
  Vue.use(SuiIcons)
  
  // --- AFTER ---
  // src/main.ts
  import { i18n } from '@/services/i18n'
  import SuiIcons from '@siteminder/sui-icons'
  import { SmBanner } from '@siteminder/sui-core/components/sm-banner'
  import { SmButton } from '@siteminder/sui-core/components/sm-button'
  import { SmInput } from '@siteminder/sui-core/components/forms/sm-input'
  import { setupVeeValidate, setupVueI18n } from '@siteminder/sui-core/libs'
  
  // setup vee-validate and vue-i18n
  // NOTE: make sure you call setupVueI18n before setupVeeValidate!
  setupVueI18n(i18n)
  setupVeeValidate()
  
  // register each sui base component
  Vue.component('sm-banner', SmBanner)
  Vue.component('sm-button', SmButton)
  Vue.component('sm-input', SmInput)
  Vue.use(SuiIcons)
  ```
- To ensure sui-core library is tree-shaken properly, do not import anything directly from "@siteminder/sui-core" module. If you are using any of the sui-core services (e.g. toastService), you will now need to import from "@siteminder/sui-core/services" instead.
  ```ts
  // --- BEFORE ---
  import { toastService } from '@siteminder/sui-core'
  
  // --- AFTER ---
  import { toastService } from '@siteminder/sui-core/services'
  ```
- Webapps should be able to continue using a full install of sui-core (all 120+ components)
- Breaking change: DateRange interface is not exposed from '@siteminder/sui-core' module. Consider inlining the interface for DateRange interface in your webapp.
- Breaking change: Review all your imports that are directly from "@siteminder/sui-core", change the import accordingly if you see your webapp not compiling.
- Breaking change: Your jest tests may fail. See the sample project [jest.config.js](https://github.com/siteminder-au/sui/blob/master/frontends/goldeneye-vue2/jest.config.js) for a reference. Specifically, you may need to do these changes:
  - update the `transform` prop so that `.mjs` files are included in being transformed by babel-jest when being run in the jest framework.
  ```ts
    transform: {
      '^.+\\.(mjs|js)$': 'babel-jest',
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.vue$': '@vue/vue2-jest'
    },
  ```
- if you are making assertions on sui-core services (e.g. toastService), do the following:
  - update your setupFilesAfterEnv jest file to contain the following
  ```ts
  // this is required otherwise we get a error like: "TypeError: Cannot redefine property: toastService"
  jest.mock('@siteminder/sui-core/services', () => {
    return {
      // see: https://stackoverflow.com/questions/40465047/how-can-i-mock-an-es6-module-import-using-jest
      // this is an internal flag used by the transpiled code to determine whether it's a
      // transpiled es6 module or a commonjs module.
      __esModule: true,
      ...jest.requireActual('@siteminder/sui-core/services')
    }
  })
  ```
- in your spec.ts file, import from @siteminder/sui-core/services:
  ```ts
  // --- BEFORE ---
  import * as suiCore from '@siteminder/sui-core'
  
  const toastServiceSpy = jest.spyOn(suiCore, 'toastService')
  
  // --- AFTER ---
  import * as suiServices from '@siteminder/sui-core/services'
  
  const toastServiceSpy = jest.spyOn(suiServices, 'toastService')
  ```
- Tree shaking resources:
  - See the sample project [main.ts](https://github.com/siteminder-au/sui/blob/master/frontends/goldeneye-vue2/src/main.ts) for a reference on how to import components individually
  - See also [storybook](https://sui.siteminder.systems/?path=/story/a-quick-start--migrating-to-sui) to see the different options available to install sui-core base components.
  - Research [wiki](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2770077745/SUI-1271+Tree+shaking) for tree shaking
- SUI-1629 remove `lazy` prop in sm-carousel. [#789](https://github.com/siteminder-au/sui/pull/789)
##### Minors & Patches
- SUI-1605 Migrate sm-input to script setup syntax [#802](https://github.com/siteminder-au/sui/pull/802)
- SUI-1447 (sm-tooltip) consume floating-vue package (sponsored by EvanYou) and create new sm-tooltip
  - Downstream projects should move from sm-tooltip to sm-tooltip2 before the vue3 upgrade
  - The new tooltip has also dropped several features and props to minimise code complexity:
    - drop focus support trigger
    - drop theming (from sui-themes)
    - drop props: visible, stopPropagration, textAlign, blockElement
  - Please ensure that when you migrate your webapp to the new sm-tooltip, you remove any usages of the above props.
  - Passing an empty title prop will still render the tooltip. This is a breaking change from the old sm-tooltip. To avoid rendering the tooltip, use disabled prop or use a v-if directive.
  ```ts
  // src/main.ts
  import SuiCore from '@siteminder/sui-core'
  import { SmTooltip } from '@siteminder/sui-core/components/sm-tooltip2'
  
  // if installing all 120+ components
  Vue.use(SuiCore, { i18n })
  
  // register the new tooltip under a different name (e.g. sm-tooltip2) if you did using a full install of sui-core
  // this is to avoid conflicts with the old sm-tooltip registration which will be using `sm-tooltip` name
  Vue.component('sm-tooltip2', SmTooltip)
  ```
- SUI-1605 disable default user agent outline styling on a, button, input elements. retain box-shadow on a, button elements [#806](https://github.com/siteminder-au/sui/pull/806)
##### Internal
- SUI-1644 Migrate sm-translations-input unit test to VTL [#788](https://github.com/siteminder-au/sui/pull/788)

## sui-core@7.0.0
##### Breaking changes
- SUI-1561 sm-carousel - re-write sm-carousel in [#741](https://github.com/siteminder-au/sui/pull/741)
  - No updates to public API and Standard storybook example
  - Added additional use case for number counter and lazy loading in storybook for the reference
  - Removed third party dependency vue-carousel :tada:
  - All Updates are internal includes sm-carousel component rewrite with improved HTML structure, class names and styles
  - The carousel image width is calculated based on its parent width. Please ensure in the code the parent element has a defined width.
##### Minors & Patches
- SUI-1382 migrate sm-loading-* [#756](https://github.com/siteminder-au/sui/pull/756)
  - Updated components: `sm-loader`, `sm-loading-bar`, `sm-loading-card`, `sm-loading-dashboard`, `sm-loading-form`, `sm-loading-home-screen`, `sm-loading-image`, `sm-loading-list`,`sm-loading-table`
- SUI-1578 Migrate sm-field-label to VTL and script setup syntax [#760](https://github.com/siteminder-au/sui/pull/760)
- SUI-1579 Migrate sm-field-error to VTL and script setup syntax [#760](https://github.com/siteminder-au/sui/pull/760)
- SUI-1590 sm-carousel - add VTL test for sm-carousel includes all parent and child components [#761](https://github.com/siteminder-au/sui/pull/761)
##### Others
- SUI-1397 Fix sm-tag tabindex test [#755](https://github.com/siteminder-au/sui/pull/755)
- SUI-1604 sm-date-picker add more test to cover rolling dates [#758](https://github.com/siteminder-au/sui/pull/758)
- SUI-1378 Migrate sm-input, sm-input-prefix-content and sm-input-suffix-content unit tests to VTL [#765](https://github.com/siteminder-au/sui/pull/765)

## sui-core@6.0.0
##### Breaking changes
- SUI-1397 migrate sm-tag to use script setup & VTL [#739](https://github.com/siteminder-au/sui/pull/739)
  - Public APIs (variables and methods) are now private. Prefer using props and events.
- SUI-1573, DP-1982 Update sm-help-card types by adding border and background colors [#736](https://github.com/siteminder-au/sui/pull/736)
  - Style properties have been refactored
  - Deprecated common variables:
    - `--sm-c-help-card-border-left`
    - `--sm-c-help-card-border-radius`
    - `--sm-c-help-card-color-background`
  - Added new variables:
    - `--sm-c-help-card-color-background-${type}` - background color per type
    - `--sm-c-help-card-color-border-${type}` - outer "border" color per type
    - `--sm-c-help-card-color-border-left-${type}` - thicker left "border" color
##### Minors & Patches
- SUI-977 sm-tabs – tablet/mobile dropdown needs to be closed by default [#721](https://github.com/siteminder-au/sui/pull/721)
- SUI-1252 Add Stylelint and fix minor issues [#719](https://github.com/siteminder-au/sui/pull/719)
- SUI-1391 Convert sm-container to use script setup & VTL [#718](https://github.com/siteminder-au/sui/pull/718)
- SUI-1505 sm-page-title – Migrate unit test to VTL + script setup [#726](https://github.com/siteminder-au/sui/pull/726)
- SUI-1389 sm-card - Migrate unit test to VTL + script setup [#728](https://github.com/siteminder-au/sui/pull/728)
  - Updated components: `sm-card-actions`, `sm-card-content`, `sm-card-graphic`, `sm-card-footer`, `sm-card-brand-graphic`
- SUI-1568 Include migrated components in vue type checking and fix issues [#730](https://github.com/siteminder-au/sui/pull/730)
  - Updated components: `sm-banner`, `sm-button`, `sm-expandable-card`
- SUI-1390 sm-carousel - investigate and migrate sm-carousel to script setup for vue2 + VTL
- SUI-1566 Convert sm-date-picker to script setup syntax and refactor implementation on columns and rows props [#737](https://github.com/siteminder-au/sui/pull/737)
##### Others
- SUI-1540 sm-container add 1367px to Percy coverage and update unit tests [#725](https://github.com/siteminder-au/sui/pull/725)
- SUI-1544 sm-app-header and sm-nav tablet nav story fixes [#725](https://github.com/siteminder-au/sui/pull/725)
- SUI-1547 Migrate sm-date-picker unit test to VTL and standardize timezone in Jest [#727](https://github.com/siteminder-au/sui/pull/727)
- SUI-1568 Enforce VTL testing conventions [#730](https://github.com/siteminder-au/sui/pull/730)
  - Updated tests: `sm-loader`, `sm-breadcrumbs`, `sm-button`, `sm-divider`, `sm-page-title`
- SUI-1577 Fix sm-card notification card story [#740](https://github.com/siteminder-au/sui/pull/740)
- SUI-1583 Upgrade docs @percy/cli from 1.24.0 to 1.26.2 [#743](https://github.com/siteminder-au/sui/pull/743)
##### Contribution to the release :clap:
- Shri Yalsangi [#736](https://github.com/siteminder-au/sui/pull/736)

## sui-core@5.0.0
##### Breaking changes
- SUI-1499 Convert sm-button to use script setup syntax and remove `data-button-test` prop and `loading-icon` component [#713](https://github.com/siteminder-au/sui/pull/713)
  - In addition, public APIs (variables and methods) are now private. Prefer using props and events.
- SUI-1498 Convert sm-banner to use script setup syntax [#713](https://github.com/siteminder-au/sui/pull/713)
  - Public APIs (variables and methods) are now private. Prefer using props and events.
- SUI-1500 Convert sm-expandable-card to use script setup syntax [#713](https://github.com/siteminder-au/sui/pull/713)
  - Public APIs (variables and methods) are now private. Prefer using props and events.
- SUI-1501 Convert sm-expandable-card-body to use script setup syntax [#713](https://github.com/siteminder-au/sui/pull/713)
  - Public APIs (variables and methods) are now private. Prefer using props and events.
- SUI-1529 Changed and removed several internal sm-vertical-nav-item classnames. Downstream projects that have style overrides on `sm-vertical-nav-item-*` classnames should audit their webapps where sm-vertical-nav-item is used for any visual regressions. [#715](https://github.com/siteminder-au/sui/pull/715)
- SUI-1529 Removed sm-vertical-nav-items slots: label, icon, suffix-icon. Use `label`, `prefix-icon` and `suffix-icon` props instead. [#715](https://github.com/siteminder-au/sui/pull/715). NOTE: `content` slot is still available, but it is not recommended to use unless absolutely necessary. Usage of `content` slot means ejecting from the default preset labelling layout and styling provided by sm-vertical-nav-item. Downstream projects using `content` slot are responsible for inserting the DOM elements and styles including the nested cross-browser compatible dot.
  ```vue
  <!-- BEFORE -->
  <sm-vertical-nav>
    <sm-vertical-nav-item
      to="/some/path"
    >
      <template #label>
        <span>{{ Sample }}</span>
      </template>
      <template #icon>
        <sm-icon name="products-booking-engine" />
      </template>
      <template #suffix-icon>
        <sm-icon name="action-open-in-new" />
      </template>
    </sm-vertical-nav-item>
  </sm-vertical-nav>
  
  <!-- AFTER -->
  <sm-vertical-nav>
    <sm-vertical-nav-item
      label="Sample"
      to="/some/path"
      prefix-icon="products-booking-engine"
      suffix-icon="action-open-in-new"
    />
  </sm-vertical-nav>
  ```

##### Minors & Patches
- SUI-1487 Convert sm-loader to use script setup syntax [#704](https://github.com/siteminder-au/sui/pull/704)
- SUI-1491 Convert sm-divider to use script setup syntax [#704](https://github.com/siteminder-au/sui/pull/704)
- SUI-1492 Convert sm-badge to use script setup syntax [#704](https://github.com/siteminder-au/sui/pull/704)
- SUI-1253 Add dangerjs script validation checks to encourage certain coding practices when raising PRs. [#712](https://github.com/siteminder-au/sui/pull/712)
- SUI-1253 Add bundlefile size check on sui-core output as part of the build. [#712](https://github.com/siteminder-au/sui/pull/712)
- SUI-1497 General npm dependency updates [#714](https://github.com/siteminder-au/sui/issues/714)
- SUI-1529 Add `suffix-badge` prop to sm-vertical-nav-item to allow users to insert a badge after the label. [#715](https://github.com/siteminder-au/sui/pull/715)

## sui-core@4.0.0
##### Breaking changes
- SUI-1340 sui-core now requires a peer dependency of vue 2.7.
- SUI-1470 Downstream projects must update their index.html and additionally download 700 weight of the font from Google fonts CDN instead:
  ```html
  <!-- index.html -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;900&display=swap" rel="stylesheet">
  ```
- SUI-1482 Removed the following components:
  - sm-lottie-player
##### Minors & Patches
- SUI-1465 Fix sm-breadcrumbs not rendering any items [#689](https://github.com/siteminder-au/sui/pull/689/)
- SUI-1466 Fix sm-progress-bar not updating when percentage is zero [#691](https://github.com/siteminder-au/sui/pull/691)
- SUI-1479 Update sm-table headers to use font-weight 600 instead of bold [#693](https://github.com/siteminder-au/sui/pull/693)
- SUI-1340 Convert sm-help-card and sm-404-page to use script setup syntax [#694](https://github.com/siteminder-au/sui/pull/694)
##### Others
- SUI-1273 Fix Jest code coverage report to exclude deprecated stories [#688](https://github.com/siteminder-au/sui/pull/688)
- SUI-1273 Mark components as deprecated in Storybook component listing [#690](https://github.com/siteminder-au/sui/pull/690)
- SUI-1445 Attempt to reduce flaky font loading in Percy Storybook [#691](https://github.com/siteminder-au/sui/pull/691)
- SUI-1251 Add additional stricter linting rules to provide guardrails on contributing to sui repo [#696](https://github.com/siteminder-au/sui/pull/696)

## sui-core@3.0.0
##### Breaking changes
- SUI-1301 Moved to vite build tool. VTU/VTL tests on downstream projects that asserts on behaviour triggered by css may fail. Tests that were observed to fail include components with:
  - toggle visibility(visibility:hidden): sm-drawer, sm-wizard, sm-accordion
    - suggested fix: (sm-wizard) use getAllByRole() instead of getByRole() when asserting for certain text
    - suggested fix: (sm-drawer, sm-accordion) remove assertions dealing with checking text has disappeared on collapse/hide
  - interactivity(pointer-events:none): sm-button
    - suggested fix: remove assertions dealing with clicking disabled buttons
  - form error field messages
    - suggested fix: add missing await waitFor() when asserting for the error field message to appear and increase waitFor timeout to 5 seconds if some assertions become flaky:
    ```ts
    await waitFor(() => expect(component.getByRole('button', { name: 'Save' })).toBeDisabled(), { timeout: 5000 })
    ```
- SUI-1301 sm-card-content when used with a sm-card with 'light' theme prop explicitly set will not span the whole width of the container. See example [PR](https://github.com/siteminder-au/platform-property/pull/4535)
- SUI-1301 Removed bundling Noto Sans google font in sui-core.
  - Downstream projects must update their index.html and download the 400,600,700,900 weights of the font from Google fonts CDN instead:
  ```html
  <!-- index.html -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;900&display=swap" rel="stylesheet">
  ```
  - Any usages of `font-weight: bold` or `font-weight: 700` will appear slightly bolder as we are now officially using out-of-the-box Noto Sans google font-weights.
- SUI-1273 Removed the following components:
  - sm-connector
  - sm-side-panel
  - sm-skip-link
  - sm-field-clear
##### New Component
- NA
##### Minors & Patches
- SUI-1238 Register sm-input inside sm-multi-select to properly test in VTL [#675](https://github.com/siteminder-au/sui/pull/675/)
##### Others
- SUI-1440 Additional fixes to reduce flakiness in Percy [#673](https://github.com/siteminder-au/sui/pull/673)
- SUI-1217 Migrate sm-select unit test to VTL [#675](https://github.com/siteminder-au/sui/pull/675/)
- SUI-1238 Migrate sm-multi-select unit test to VTL [#675](https://github.com/siteminder-au/sui/pull/675/)
- SUI-1453, SUI-1454 Migrate sm-badge and sm-banner unit tests to VTL [#679](https://github.com/siteminder-au/sui/pull/679)
##### Contribution to the release :clap:
- NA

## sui-core@2.1.0
##### Breaking changes
- NA
##### New Component
- NA
##### Minors & Patches
- NA
##### Others
- SUI-1334 Migrate sm-table unit test to VTL [#659](https://github.com/siteminder-au/sui/pull/659)
- SUI-1336 Migrate sm-form unit test to VTL [#659](https://github.com/siteminder-au/sui/pull/659)
- SUI-1265, SUI-1356 Add Percy to Storybook and optimize/reduce stories for visual testing [#664](https://github.com/siteminder-au/sui/pull/664)
- SUI-1408 Add Percy specific story setup on components with poppers [#671](https://github.com/siteminder-au/sui/pull/671)
- SUI-1366: upgrade typescript v5, jest v29, rollup and vue 2.7
##### Contribution to the release :clap:
- NA

## sui-core@2.0.0
##### New Component
- SUI-1219 Add sm-help-card component [#653](https://github.com/siteminder-au/sui/pull/653)
##### Minors & Patches
- SUI-1241 Add @testing-library/user-event and bump babel-jest to v25 in devDependencies [#641](https://github.com/siteminder-au/sui/pull/641)
- SUI-1239 Upgrade @vue/test-utils devDependency to latest minor version [#641](https://github.com/siteminder-au/sui/pull/641)
- SUI-1236 Add goldeneye files (test component and spec file) for VTL testing [#648](https://github.com/siteminder-au/sui/pull/648)
##### Others
- SUI-1241 Migrate sm-accordion tests to VTL [#641](https://github.com/siteminder-au/sui/pull/641)
- SUI-1239 Migrate sm-button tests to VTL [#641](https://github.com/siteminder-au/sui/pull/641)
- SUI-1297 Migrate sm-expandable-card tests to VTL [#649](https://github.com/siteminder-au/sui/pull/649)
##### Backward compatibility
- SUI-1255: (all) node v18 upgrade
##### Contribution to the release :clap:
- NA

## sui-core@1.30.1 (17/Apr/2023)
##### New Component
- NA

##### Minors & Patches
- SUI-1212 Fix sm-select and sm-multi-select grouped variant when selecting codes with matching substrings [#625](https://github.com/siteminder-au/sui/pull/625)

##### Others
- NA

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA


## sui-core@1.30.0 (20/Mar/2023)
##### New Component
- NA

##### Minors & Patches
- SUI-1185 Add new props to sm-wizard and sm-wizard-step to attach attributes to clickable elements [#603](https://github.com/siteminder-au/sui/pull/603)
- SUI-1188 Add `custom` attribute to sm-app-header-link, sm-horizontal-nav-item, sm-nav-items and sm-vertical-nav-item's router-link to fix Vue Router 4 warnings [#604](https://github.com/siteminder-au/sui/pull/604)

##### Others
- NA

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA


## sui-core@1.29.0 (06/Mar/23)
##### New Component
- NA

##### Minors & Patches
- SUI-1174 Add sm-drawer mobile-actions slot and general style updates [#586](https://github.com/siteminder-au/sui/pull/586)

##### Others
- SUI-1155 Add more unit tests and set Jest coverage thresholds [#577](https://github.com/siteminder-au/sui/pull/577) [#597](https://github.com/siteminder-au/sui/pull/597)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA


## sui-core@1.28.2 (16/Feb/23)
##### New Component
- NA

##### Minors & Patches
- SUI-1182 Make hasChildren in sm-vertical-nav-item reactive [#576](https://github.com/siteminder-au/sui/pull/576)

##### Others
- NA

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- Ge Liu - SUI-1182 Make hasChildren in sm-vertical-nav-item reactive [#576](https://github.com/siteminder-au/sui/pull/576)

## sui-core@1.28.1 (06/Feb/23)
##### New Component
- NA

##### Minors & Patches
- SUI-1170 Fix sm-media to consistently emit `filesAdded` event on Vue 2.6 and Vue 2.7 [#562](https://github.com/siteminder-au/sui/pull/562)

##### Others
- SUI-1155 Add sm-form, sm-pagination, sm-vertical-nav, sm-content-slider-graphic unit tests [#559](https://github.com/siteminder-au/sui/pull/559) [#570](https://github.com/siteminder-au/sui/pull/570)
- SUI-1152 Add useClickedState and useEventProxy unit tests [#559](https://github.com/siteminder-au/sui/pull/559)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.28.0 (23/Jan/23)
##### New Component
- NA

##### Minors & Patches
- SUI-1104 Add theming support to `sm-slider` [#551](https://github.com/siteminder-au/sui/pull/551)
- SUI-1160 Add `showSelectAllOption` and `showSelectGroupOption` props in `sm-multi-select` to change select all/group options' availability [#554](https://github.com/siteminder-au/sui/pull/554)
- SUI-1161 Update `sm-select`'s border color to red when the field is invalid [#545](https://github.com/siteminder-au/sui/pull/545)

##### Others
- SUI-1155 Update `sm-date-picker`'s timezone tests and add `sm-user-list`, `sm-property-menu` and `sm-user-menu` unit tests [#539](https://github.com/siteminder-au/sui/pull/539) [#555](https://github.com/siteminder-au/sui/pull/555)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- Gillian Ng - SUI-1161 Update `sm-select`'s border color to red when the field is invalid [#545](https://github.com/siteminder-au/sui/pull/545)

## sui-core@1.27.2 (09/Jan/23)
##### New Component
- NA

##### Minors & Patches
- SUI-1151 fix sm-app-header's subtitle border-color in white-labelling [#535](https://github.com/siteminder-au/sui/pull/535)
- SUI-1090 fix sm-connector arrow alignment [#537](https://github.com/siteminder-au/sui/pull/537)
- SUI-1018 update sm-color-picker hex mixed input styles [#540](https://github.com/siteminder-au/sui/pull/540)

##### Others
- SUI-1146 Add missing tests for simple components [#531](https://github.com/siteminder-au/sui/pull/531)
- SUI-1154 lazy-loader directive tests [#538](https://github.com/siteminder-au/sui/pull/538)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.27.1 (06/Dec/22)
##### New Component
- NA

##### Minors & Patches
- SUI-1030 sm-expandable-card-body is-help-card variant background color fix [#526](https://github.com/siteminder-au/sui/pull/526)
- SUI-1081 sm-tabs check invalid tab [#528](https://github.com/siteminder-au/sui/pull/528)

##### Others
- SUI-1083 update sm-404-page stories [#527](https://github.com/siteminder-au/sui/pull/527)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.27.0 (23/Nov/22)
##### New Component
- SUI-757 Add sm-side-panel component [#522](https://github.com/siteminder-au/sui/pull/522)

##### Minors & Patches
- SUI-1079 Add translations for sm-calendar, sm-multi-select, sm-tag-filters, sm-aside and sm-side-panel [#525](https://github.com/siteminder-au/sui/pull/525)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.26.0 (17/Nov/22)
##### New Component
- NA

##### Minors & Patches
- SUI-1045/EP-4510 Use vue-demi to make sui-core compatible for vue 2.6 and 2.7 FE projects [#493](https://github.com/siteminder-au/sui/pull/493)
- SUI-1080 sm-wizard add backButtonText prop [#521](https://github.com/siteminder-au/sui/pull/521)

##### Others
- SUI-1078 Add translations demo in Storybook [#520](https://github.com/siteminder-au/sui/pull/520)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- Rommel Vergara - SUI-1045/EP-4510 Use vue-demi to make sui-core compatible for vue 2.6 and 2.7 FE projects [#493](https://github.com/siteminder-au/sui/pull/493)

## sui-core@1.25.0 (07/Nov/22)
##### New Component
- NA

##### Minors & Patches
- SUI-896 sm-date-picker use republished v-calendar package to fix timezones [#509](https://github.com/siteminder-au/sui/pull/509)

##### Others
- SUI-1075 Add sm-date-picker tests [#509](https://github.com/siteminder-au/sui/pull/509)
- SUI-1077 Add sm-popover tests [#510](https://github.com/siteminder-au/sui/pull/510)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- Rommel Vergara - SUI-896 sm-date-picker use republished v-calendar package to fix timezones [#509](https://github.com/siteminder-au/sui/pull/509)

## sui-core@1.24.0 (27/Oct/22)
##### New Component
- NA

##### Minors & Patches
- SUI-1066 sm-translations-input fix default language field [#507](https://github.com/siteminder-au/sui/pull/507)
- SUI-1072 sm-translations-input add disabledDelete option [#505](https://github.com/siteminder-au/sui/pull/505)

##### Backward compatibility
- SUI-1066 exposed `defaultInputValue` (string) in sm-translation-input has been changed to `defaultInput` (object)

##### Contribution to the release :clap:
- Adriel de Guzman - SUI-1072 sm-translations-input new option


## sui-core@1.23.0 (18/Oct/22)
##### New Component
- NA

##### Minors & Patches
- SUI-1044 Upgrade @vue/composition-api to 1.7.0 and vue to 2.6.14 [#489](https://github.com/siteminder-au/sui/pull/489)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- Rommel Vergara - SUI-1044 Upgrade @vue/composition-api to 1.7.0 and vue to 2.6.14 [#489](https://github.com/siteminder-au/sui/pull/489)


## sui-core@1.22.1 (12/Oct/22)
##### New Component
- NA

##### Minors & Patches
- SUI-943 Add tooltip in sm-aside toggle button when hovered [#497](https://github.com/siteminder-au/sui/pull/497)
- SUI-976 Make sm-tooltip smaller [#497](https://github.com/siteminder-au/sui/pull/497)
- SUI-1048 Update sm-calendar unit test to mock default locale [#495](https://github.com/siteminder-au/sui/pull/495)
- SUI-1049 Upgrade Storybook's vue and @vue/composition-api dependencies [#496](https://github.com/siteminder-au/sui/pull/496) [#498](https://github.com/siteminder-au/sui/pull/498)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- Rommel Vergara - Upgrade Storybook's vue and @vue/composition-api dependencies [#496](https://github.com/siteminder-au/sui/pull/496)

## sui-core@1.22.0 (28/Sept/22)
##### New Component
- NA

##### Minors & Patches
- SUI-953 sm-tag style fix [#492](https://github.com/siteminder-au/sui/pull/492)
- SUI-957 sm-nav expose `closeNav` function as slot prop and emit `toggle` in sm-vertical-nav-item [#492](https://github.com/siteminder-au/sui/pull/492)
- SUI-1012 sm-loading-list style updates [#492](https://github.com/siteminder-au/sui/pull/492)
- SUI-1016 sm-vertical-nav-item add suffix icon slot and prop [#494](https://github.com/siteminder-au/sui/pull/494)

##### Backward compatibility
- NA

## sui-core@1.21.8 (14/Sept/22)
##### New Component
- NA

##### Minors & Patches
- SUI-1011 sm-tab add new hidden prop [#483](https://github.com/siteminder-au/sui/pull/483)
- SUI-1006 sm-button update loading spinners for button types [#484](https://github.com/siteminder-au/sui/pull/484)

##### Backward compatibility
- NA

## sui-core@1.21.7 (05/Sept/22)
##### New Component
- NA

##### Minors & Patches
- SUI-1007 Require new callback in sm-pagination to handle page changes [#482](https://github.com/siteminder-au/sui/pull/482)

##### Backward compatibility
- NA

## sui-core@1.21.6 (31/Aug/22)
##### New Component
- NA

##### Minors & Patches
- Remove unused variables in whitelabelling [b0ff098](https://github.com/siteminder-au/sui/commit/b0ff0983a347445a15126d918ee3383de1bc7751)
- SUI-989 sm-wizard story updates [#480](https://github.com/siteminder-au/sui/pull/480)
- SUI-991 update illustrations listing [#480](https://github.com/siteminder-au/sui/pull/480)
- SUI-992 sm-radio label wrapping fix and sm-checkbox minor spacing update [#480](https://github.com/siteminder-au/sui/pull/480)
- SUI-999 sm-tabs reactive disabled prop fix [#480](https://github.com/siteminder-au/sui/pull/480)

##### Backward compatibility
- NA


## sui-core@1.21.5 (18/Aug/22)
##### New Component
- NA

##### Minors & Patches
- SUI-936 sm-select add new props and event for remote load and search [#475](https://github.com/siteminder-au/sui/pull/475)
- SUI-970 sm-accordion-graphic fix style [#475](https://github.com/siteminder-au/sui/pull/475)
- SUI-968 sm-app-header add titleLink prop [#476](https://github.com/siteminder-au/sui/pull/476)
- SUI-973 Add illustrations documentation in Storybook [#477](https://github.com/siteminder-au/sui/pull/477)

##### Backward compatibility
- NA


## sui-core@1.21.4 (5/Aug/22)
##### New Component
- NA

##### Minors & Patches
- SUI-966 sm-multi-select add footer slot in dropdown [#469](https://github.com/siteminder-au/sui/pull/469)
- SUI-971 sm-dialog update title margin [#469](https://github.com/siteminder-au/sui/pull/469)

##### Backward compatibility
- NA


## sui-core@1.21.3 (3/Aug/22)
##### New Component
- NA

##### Minors & Patches
- SUI-927 sm-vertical-nav-item fix auto-open behaviour when child item is wrapped on other elements [#464](https://github.com/siteminder-au/sui/pull/464)

##### Backward compatibility
- NA


## sui-core@1.21.2 (20/july/22)
##### New Component
- NA

##### Minors & Patches
- SUI-930 sm-aside add footer slot [#462](https://github.com/siteminder-au/sui/pull/462)
- SUI-933 sm-tabs add before-tab-change prop [#457](https://github.com/siteminder-au/sui/pull/457)
- SUI-941 sm-wizard fix header truncation [#459](https://github.com/siteminder-au/sui/pull/459)
- SUI-934 sm-text-truncator fix read more availability bug and style updates [#459](https://github.com/siteminder-au/sui/pull/459)
- SUI-938 sm-html-truncator style updates [#459](https://github.com/siteminder-au/sui/pull/459)
- SUI-937 mobile heading style updates [#459](https://github.com/siteminder-au/sui/pull/459)

##### Style updates
- `sm-text-truncator` and `sm-html-truncator`’s read more/less button alignment is now flushed to the left so it’s aligned with the truncated content. If there are explicit overrides with the styles, e.g products added left spacer on the truncated content, that can be removed to align the elements.

##### Backward compatibility
- NA

## sui-core@1.21.1 (7/july/22)
##### New Component
- SUI-916 Add sm-404-page [#454](https://github.com/siteminder-au/sui/pull/454)

##### Minors & Patches
- SUI-929 sm-vertical-nav-item fix for nested content slot [#458](https://github.com/siteminder-au/sui/pull/458)
- SUI-917 sm-calendar add is-range prop for month/year picker [#455](https://github.com/siteminder-au/sui/pull/455)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.20.0 (23/june/22)
##### New Component
- SUI-898 New sm-lottie-player [#451](https://github.com/siteminder-au/sui/pull/451)

##### Minors & Patches
- SUI-889 sm-table add responsive stacked rows prop [#452](https://github.com/siteminder-au/sui/pull/452)
- SUI-921 scroll lock fix for sm-drawer, sm-dialog, sm-nav and sm-wizard [#](https://github.com/siteminder-au/sui/pull/453)
- SUI-922 sm-card upsell alignment with new branding [#450](https://github.com/siteminder-au/sui/pull/450)

##### Breaking change
- SUI-898 We’ve added an external dependency `lottie-web` for the new component sm-lottie-player. Depending on the consumer’s Jest setup (e.g SUI components are not stubbed by default), this  dependency could cause failures when running unit tests via Jest. To resolve the issue, [jest-canvas-mock](https://www.npmjs.com/package/jest-canvas-mock) can be installed as a dev dependency. This _may not_ be an issue if SUI components are stubbed by default.

##### Contribution to the release :clap:
- NA

## sui-core@1.19.0 (08/june/22)
##### New Component
- SUI-812 New sm-multi-select and sm-tag-filters components [#430](https://github.com/siteminder-au/sui/pull/430)

##### Minors & Patches
- SUI-813 sm-select style updates [#430](https://github.com/siteminder-au/sui/pull/430)
- SUI-890 sm-vertical-nav for tablet and mobile [#448](https://github.com/siteminder-au/sui/pull/448)
- SUI-903 sm-input textarea support inside sm-table [#445](https://github.com/siteminder-au/sui/pull/445)
- SUI-904 sm-select support inside sm-table [#444](https://github.com/siteminder-au/sui/pull/444)
- SUI-907 sm-input update color for disbled loading spinner [#449](https://github.com/siteminder-au/sui/pull/449)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.18.0 (08/june/22)
- No updates

## sui-core@1.17.0 (26/May/22)
##### New Component
- NA

##### Minors & Patches
- SUI-740 sm-table add table size options [#441](https://github.com/siteminder-au/sui/pull/441)
- SUI-892 sm-input add validation debounce and mode props [#439](https://github.com/siteminder-au/sui/pull/439) [#443](https://github.com/siteminder-au/sui/pull/443)

##### Backward compatibility
- SUI-892 Various form components' invalid label state condition has been switched from `touched` to `validated`. The label's invalid style class trigger is expected to change. However, `sm-field-label` will still check for `touched` for backward compatibility in case this is used as a standalone component, e.g in custom form components.

##### Contribution to the release :clap:
- NA

## sui-core@1.16.0 (26/May/22)
- No updates

## sui-core@1.15.2 (12/May/22)
##### New Component
- NA

##### Minors & Patches
- SUI-834 sm-input truncation on inactive field [#436](https://github.com/siteminder-au/sui/pull/436)
- SUI-853 sm-wizard add overlay slot and animations [#436](https://github.com/siteminder-au/sui/pull/436)
- SUI-884 sm-app-header and sm-drawer new props [#438](https://github.com/siteminder-au/sui/pull/438)
- SUI-888 sm-vertical-nav active indicator on content slot fix [#437](https://github.com/siteminder-au/sui/pull/437)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.15.1 (28/Apr/22)
##### New Component
- NA

##### Minors & Patches
- Update tailwind spacing variables [#431](https://github.com/siteminder-au/sui/pull/431)
<br/>


- SUI-821 sm-select add allowEmpty prop and deprecate clearable prop [#429](https://github.com/siteminder-au/sui/pull/429)
- SUI-867 sm-card update upsell cards [#432](https://github.com/siteminder-au/sui/pull/432) [#435](https://github.com/siteminder-au/sui/pull/435)
- SUI-883 sm-card remove static box-shadow in upsell cards [#434](https://github.com/siteminder-au/sui/pull/434)
- Fix sm-breadcrumbs unit test [#428](https://github.com/siteminder-au/sui/pull/428)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.15.0 (14/Apr/22)
##### New Component
- SUI-729 Slider [#383](https://github.com/siteminder-au/sui/pull/383)

##### Minors & Patches
- SUI-852 sm-dialog increase padding on right [#420](https://github.com/siteminder-au/sui/pull/420)
- SUI-860 sm-switch focused z-index and opacity issues [#420](https://github.com/siteminder-au/sui/pull/420)
- SUI-827 sm-inline-card unwanted border-bottom [#420](https://github.com/siteminder-au/sui/pull/420)
- SUI-841 sm-select grouped options placeholder and disabled bugs [#424](https://github.com/siteminder-au/sui/pull/424)
- SUI-656 form components style updates [#424](https://github.com/siteminder-au/sui/pull/424)
- SUI-869 Radio layout update [#425](https://github.com/siteminder-au/sui/pull/425)
- SUI-847 Mismatched table cell heights in expandable rows [#423](https://github.com/siteminder-au/sui/pull/425)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## [sui-core@1.14.2 (07/Apr/22)
##### New Component
- LH-9161 Add sm-breadcrumbs component [#407](https://github.com/siteminder-au/sui/pull/407)

##### Minors & Patches
- NA

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- Edward Chen


## sui-core@1.14.1 (05/Apr/22)
##### New Component
- NA

##### Minors & Patches
- SUI-842 sm-sidebar updates to sync with sm-aside [#418](https://github.com/siteminder-au/sui/pull/418)
- SUI-864 sm-date-picker timezone highlight current date fix [#422](https://github.com/siteminder-au/sui/pull/422)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.14.0 (01/Apr/22)
##### New Component
- NA

##### Improvments :bulb:
- SUI-866 Vue-i18n code optimisation: [#409](https://github.com/siteminder-au/sui/pull/409/files)
- SUI-854 Sm-tooltip target doesn't listen to v-if changes: [#commit](https://github.com/siteminderau/sui/commit/dde893d20e3624d79f88e6ab22385a42b4713c41)
- SUI-851 createPopper improvements (sm-popover, sm-tooltip, sm-dropdown, sm-color-picker): [#403](https://github.com/siteminder-au/sui/pull/403/files), [#404](https://github.com/siteminder-au/sui/pull/404/files), [#417](https://github.com/siteminder-au/sui/pull/417/files), sm-dropdown [#408](https://github.com/siteminder-au/sui/pull/408/files), sm-tooltip [#416](https://github.com/siteminder-au/sui/pull/416/files)
- All updates: click on *File Changed* tab [#code-diif](https://github.com/siteminder-au/sui/compare/v1.11.1...sui-core.v1.14.0)
- Release note [#here](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2421195333/Performance+updates+and+Code+optimisation+sui-core)

##### Breaking Changes :pencil:
- Performance updates in createPopper and VueI18n have breaking changes around testing.
- For more details and steps to resolve the issues please see [Performance updates and Code optimisation (sui-core)](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2421195333/Performance+updates+and+Code+optimisation+sui-core#Breaking-Changes-for-the-Team)

##### Contribution to the release :clap:
- NA

## sui-core@1.13.0 (17/Mar/22)
##### What's New
- Updated vue-i18n depedency, es3 to es5 in tsconfig.build.json and SUI peerDependencies [#399](https://github.com/siteminder-au/sui/pull/399)

##### Minors & Patches
- SUI-843 Drag and drop image to empty state <sm-media/> doesn't trigger change event.[#402](https://github.com/siteminder-au/sui/pull/402)
- SUI-833 Add Spacing standards and guideline in SUI[#401](https://github.com/siteminder-au/sui/pull/401)
- SUI-831 Update SUI color variables in TailWind's config[#401](https://github.com/siteminder-au/sui/pull/401)
- SUI-826 Update color palette[#398](https://github.com/siteminder-au/sui/pull/398)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- George Zhao

## sui-core@1.12.2 (11/Mar/22)
##### New Component
- NA

##### Minors & Patches
- SUI-838 wizard buttons revert back to left alignment [#400](https://github.com/siteminder-au/sui/pull/400)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.12.0 (3/Mar/22)
##### New Component
- NA

##### Minors & Patches
- SUI-823 Add close icon button to banner component [#397](https://github.com/siteminder-au/sui/pull/397)
- SUI-802 Help Panel in Wizards [#397](https://github.com/siteminder-au/sui/pull/397)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.11.3 (23/Feb/22)
##### New Component
- NA

##### Minors & Patches
- CharCode is deprecated [#a1a3122](https://github.com/siteminder-au/sui/commit/a1a3122c6d1fecb8bd87636a8daddf03a8d43522)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.11.1 (16/Feb/22)
##### New Component
- NA

##### Minors & Patches
- SUI-805 Enhance media component to allow dragging items between multiple media components [#393](https://github.com/siteminder-au/sui/pull/393)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.11.1 (16/Feb/22)
##### New Component
- NA

##### Minors & Patches
- SUI-804 Platform Property: Distorted Tab Option When Browser Gets Resized [#390](https://github.com/siteminder-au/sui/pull/390)
- SUI-686 Vertical navigation – expand / collapse [#390](https://github.com/siteminder-au/sui/pull/390)
- SUI-659 Allow Hiding of 'Back' Option on SM-Wizard Component [#390](https://github.com/siteminder-au/sui/pull/390)
- SUI-593 User can input minus sign in the middle for a numeric input [#390](https://github.com/siteminder-au/sui/pull/390)
- SUI-809 Custom class on dialog content [#392](https://github.com/siteminder-au/sui/pull/392)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.11.0 (04/Feb/22)
##### New Component
- NA

##### Minors & Patches
- SUI-690 Tablet navigation property switcher sub-navigation [#384](https://github.com/siteminder-au/sui/pull/384)
- SUI-752, SUI-769 Date-picker popover placement fixes [#385](https://github.com/siteminder-au/sui/pull/385)
- SUI-805 Enhance media component to allow dragging items between multiple media components [#388](https://github.com/siteminder-au/sui/pull/388)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.10.0
- No updates

## sui-core@1.9.0 (19/Jan/22)
##### New Component
- NA

##### Minors & Patches
- SUI-761 Add white-labelling for smart-guide button in sm-app-header [#376](https://github.com/siteminder-au/sui/pull/376)
- SUI-602 Add sm-select label with description in dropdown option [#364](https://github.com/siteminder-au/sui/pull/364) [#380](https://github.com/siteminder-au/sui/pull/380)
- SUI-751 Input theming [#374](https://github.com/siteminder-au/sui/pull/374) [#379](https://github.com/siteminder-au/sui/pull/379)
- SUI-775 Select theming [#374](https://github.com/siteminder-au/sui/pull/374) [#379](https://github.com/siteminder-au/sui/pull/379)
- SUI-779 Add theming tag in component listing [#375](https://github.com/siteminder-au/sui/pull/375) [#379](https://github.com/siteminder-au/sui/pull/379)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.8.0 (6/jan/22)
##### New Component
- NA

##### Minors & Patches
- SUI-738 - Update SUI colors [#362](https://github.com/siteminder-au/sui/pull/362)
- SUI-765 - Fix pre-filled sm-calendar display [#368](https://github.com/siteminder-au/sui/pull/368)
- SUI-768 - Fix sm-nav-items wrapped in a custom component [#369](https://github.com/siteminder-au/sui/pull/369)
- SUI-760 - Add placeholder text to any select input that has 'filterable' set to true by default [#370](https://github.com/siteminder-au/sui/pull/370) [#372](https://github.com/siteminder-au/sui/pull/372)
- SUI-762 - Expand collapse btn on vert navigation [#370](https://github.com/siteminder-au/sui/pull/370) [#372](https://github.com/siteminder-au/sui/pull/372)
- SUI-681 - Carousel UI fixes [#370](https://github.com/siteminder-au/sui/pull/370) [#372](https://github.com/siteminder-au/sui/pull/372)
- SUI-692 - Check Localisation for the date-picker [#370](https://github.com/siteminder-au/sui/pull/370)
- SUI-771 - Add the theme variables for the components that have a button as a child component [#371](https://github.com/siteminder-au/sui/pull/371)

##### Breaking change
- sm-date-picker rename suffx slot name to suffix [4081068](4081068a4b990a53b1bfce7a735b772b21ed426b)

##### Contribution to the release :clap:
- NA

##  sui-core@1.7.6 (15/dec/21)
##### New Component
- NA

##### Minors & Patches
- SUI-766 Broken forms in Platform Property [#367](https://github.com/siteminder-au/sui/pull/367/files)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.7.5 (8/dec/21)
##### New Component
- NA

##### Minors & Patches
- SUI-713 Create new slot in header for Smart Guide button [#365](https://github.com/siteminder-au/sui/pull/365)
- SUI-730 sm-popover can't be triggered by hover inside a tablet nav [#363](https://github.com/siteminder-au/sui/pull/363)
- SUI-708 Header logo does not have highlight colour [#366](https://github.com/siteminder-au/sui/pull/366)
- Update "not tested" tags in Storybook component listing [#361](https://github.com/siteminder-au/sui/pull/361)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.7.4 (8/dec/21)
## sui-core@1.7.3 (8/dec/21)
## sui-core@1.7.2 (8/dec/21)
## sui-core@1.7.1 (8/dec/21)
- No updates

## sui-core@1.7.0 (24/nov/21)
##### New Component
- SUI-684 - Add sm-calendar component with month and year picker [#358](https://github.com/siteminder-au/sui/pull/358) [#360](https://github.com/siteminder-au/sui/pull/360)

##### Minors & Patches
- SUI-735 - Sync transition duration in sm-input [#359](https://github.com/siteminder-au/sui/pull/359)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.6.0 (17/nov/21)

##### New Component
- NA

##### Minors & Patches
- SUI-696 New Slots in Header for app switcher [#356](https://github.com/siteminder-au/sui/pull/356)
- SUI-715 Add target props for the sm-app-header home icon link [#356](https://github.com/siteminder-au/sui/pull/356)
- SUI-710 Add partner name in sm-header [#356](https://github.com/siteminder-au/sui/pull/356)
- SUI-706 Update SM logo mark on app header [#356](https://github.com/siteminder-au/sui/pull/356)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA


## sui-core@1.5.3 (10/nov/21)
##### New Component
- NA

##### Minors & Patches
- SUI-685 Jump to second/third level of matching nav item on sm-nav open [#354](https://github.com/siteminder-au/sui/pull/354)
- SUI-691 Auto-close sm-nav once a link is clicked [#354](https://github.com/siteminder-au/sui/pull/354)
- SUI-697 [Insights] Updates in Tabs component [#355](https://github.com/siteminder-au/sui/pull/355)
- SUI-703 Allow prop to disable a tab in sm-tabs component and allow popover on hover [#355](https://github.com/siteminder-au/sui/pull/355)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.5.2 (05/nov/21)
##### New Component
- NA

##### Minors & Patches
- SUI-688 Include the Localisation to the SUI for different languages [#351](https://github.com/siteminder-au/sui/pull/351)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.5.1 (04/nov/21)
##### New Component
- NA

##### Minors & Patches
- SUI-711 [1.5.0] Clicking on sm-switch label no longer toggles its value [#350](https://github.com/siteminder-au/sui/pull/350)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.5.0 (29/oct/21)
##### New Component
- NA

##### Minors & Patches
- SUI-705 Radio button UI alignment issue after the font-updates (eslint fix)[#347](https://github.com/siteminder-au/sui/pull/347)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.4.1 (28/oct/21)
##### New Component
- NA

##### Minors & Patches
- SUI-665 Theming tech and design research and document
- SUI-678 Add sm-toast timeout props and fix console error from toast service [#343](https://github.com/siteminder-au/sui/pull/343)
- SUI-680 Add new prop in sm-list-item to handle overflowing content [#343](https://github.com/siteminder-au/sui/pull/343)
- SUI-695 / SUI-698 Fix sm-app-header positions when notification is not available [#345](https://github.com/siteminder-au/sui/pull/345)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@1.4.0 (13/oct/21)
##### New Component
- NA

##### Minors & Patches
- SUI-671 Updates the letter spacing for the heading in typography: sui-core, sui-sidebar and sui-header [#340](https://github.com/siteminder-au/sui/pull/340)
- SUI-613 Hidden content are focusable in some components [#339](https://github.com/siteminder-au/sui/pull/339)
- SUI-669 Fix sm-wizard and other components' accessibility issues [#338](https://github.com/siteminder-au/sui/pull/338)
- sm-banner lint and test fixes [#342](https://github.com/siteminder-au/sui/pull/342)
- SUI-667 Eslint upgrade version to : 2.8.1  [#331](https://github.com/siteminder-au/sui/pull/331)

##### Breaking changes
- The Eslint upgrade might cause dependency conflicts in consumers. It’s been observed that some components were not rendering properly after the upgrade. Fixes have been released in sui-core@1.5.0 and sui-core@1.5.1.

##### Contribution to the release :clap:
- George Zhao <george.zhao@siteminder.com> : sm-toast on close improvements [#328](https://github.com/siteminder-au/sui/pull/328)

## sui-core@1.2.0, sui-core@1.3.0
- No update

## sui-core@1.1.0 (29/Sept/21)
##### New Component
- SUI-487 Component - Full width banners [#325](https://github.com/siteminder-au/sui/pull/325)

##### Minors & Patches
- SUI-660 Editable cells in sm-table [#324](https://github.com/siteminder-au/sui/pull/324)
- SUI-661 Fix shrinking icon in sm-inline-card [#324](https://github.com/siteminder-au/sui/pull/324)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA


## sui-core@1.0.0 (15/Sept/21)
### Major:exclamation:
- SUI-305 Implement Google Noto [#317](https://github.com/siteminder-au/sui/pull/317)

##### New Component
- NA

##### Minors
- NA

##### Patches
- Add how to use Storybook section [#322](https://github.com/siteminder-au/sui/pull/322)
- Tablet navigation updates [#321](https://github.com/siteminder-au/sui/pull/321)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@0.113.3 (02/Sept/21)
##### New Component
- NA

##### Minors
- NA

##### Patches
- SUI-649 sm-nav-items crashes after clicking on the item [#318](https://github.com/siteminder-au/sui/pull/318)

##### Backward compatibility
- SUI-653 Tablet Navigation Design Rules [#320](https://github.com/siteminder-au/sui/pull/320)

##### Contribution to the release :clap:
- NA

## sui-core@0.113.2 (01/Sept/21)
##### New Component
- NA

##### Minors
- NA

##### Patches
- SUI-624 Improve segmented radio buttons animation [#315](https://github.com/siteminder-au/sui/pull/315)
- SUI-628 Translations input delete button is misaligned [#315](https://github.com/siteminder-au/sui/pull/315)
- SUI-637 Unable to enter decimal values whose fraction starting with 0 in sm-input component [#315](https://github.com/siteminder-au/sui/pull/315)
- SUI-645 Fix icon styling in sm-toast with long messages [#315](https://github.com/siteminder-au/sui/pull/315)
- SUI-650 Invalid role for sm-field-error and duplicate IDs in sm-loading-image [#315](https://github.com/siteminder-au/sui/pull/315)
- SUI-652 Add miniInfo option to toastService [#316](https://github.com/siteminder-au/sui/pull/316)
- SUI-594 Include an Audit process  [#319](https://github.com/siteminder-au/sui/pull/319)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@0.113.1 (18/Aug/21)
##### New Component
- NA

##### Minors
- NA

##### Patches
- SUI-627 Pagination background does not cover the page value [#307](https://github.com/siteminder-au/sui/pull/307)
- SUI-642 Remove border on radio button clicked state and fix accessibility [#308](https://github.com/siteminder-au/sui/pull/308)
- SUI-642 Animation fix [#314](https://github.com/siteminder-au/sui/pull/314)
- SUI-643,644 Design System storybook improvements [#309](https://github.com/siteminder-au/sui/pull/309)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@0.113.0 (05/Aug/21)
##### New Component
- NA

##### Minors
- SUI-309 Update to segmented/grouped radio button [#300](https://github.com/siteminder-au/sui/pull/300)

##### Patches
- SUI-599 Focus trap for dialogs [#301](https://github.com/siteminder-au/sui/pull/301)
- SUI-626 Disabled sm-form fields can still be accessed [#304](https://github.com/siteminder-au/sui/pull/304)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-core@0.112.0 (05/Aug/21)
- No updates

## sui-core@0.111.0 (05/Aug/21)
##### New Component
- NA

##### Minors & Patches
- SUI-638 Expandable card body, Open one at a time [#303](https://github.com/siteminder-au/sui/pull/303)

##### Backward compatibility
- SUI-634 (Phase 1) Update the SUI variables name to align the new Nexus variables [#302](https://github.com/siteminder-au/sui/pull/302)

##### Contribution to the release :clap:
- NA

## sui-core@0.110.0 (05/Aug/21)
- No updates

## sui-core@0.109.0 (21/July/21)
##### New Component
- NA

##### Minors
- SUI-560 Update v-calendar version 2.3.1 [#297](https://github.com/siteminder-au/sui/pull/297)

##### Patches
- SUI-622 Input fields - error state - input border should be red [#294](https://github.com/siteminder-au/sui/pull/294)
- SUI-620 Button dimension changes when switched to disabled state [#294](https://github.com/siteminder-au/sui/pull/294)
- SUI-619 Header - Help dropdown menu[#296](https://github.com/siteminder-au/sui/pull/296) [#299](https://github.com/siteminder-au/sui/pull/299)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- George Zhao <george.zhao@siteminder.com> : sm-select expose option types [#286](https://github.com/siteminder-au/sui/pull/286)

## sui-core@0.108.2 (07/July/21)
##### New Component
- NA

##### Minors and patches
- SUI-615 sm-media-item can't be unselected when clicking on the checked icon [#292](https://github.com/siteminder-au/sui/pull/292)
- SUI-612 sm-select options list is transparent when multiple sm-cards are stacked below each other [#288](https://github.com/siteminder-au/sui/pull/288)
- SUI-604 Wizard - disable cursor pointer when navigating via stepper is disabled [#288](https://github.com/siteminder-au/sui/pull/288)
- SUI-614 Missing labels in sm-tag and sm-pagination [#284](https://github.com/siteminder-au/sui/pull/284)
- SUI-610 Accessibility fixes - story files and sm-table-th [#285](https://github.com/siteminder-au/sui/pull/285)
- SUI-600 add loading and disabled states for buttons inside sm dialog service [#293](https://github.com/siteminder-au/sui/pull/293)

##### Backward compatibility
- NA

##### Contribution to the release
- NA

## sui-core@0.108.1 (24/Jun/21)
##### New Component
- NA

##### Minors and patches
- Dialog bug fix [#diff](https://github.com/siteminder-au/sui/compare/v0.100.0...sui-core.v0.108.1)

##### Backward compatibility
- NA

## sui-core@0.108.0 (23/Jun/21)
##### New Component
- SUI-519 Channel mapping - connectors [#279](https://github.com/siteminder-au/sui/pull/279/files)

##### Minors and patches
- SUI-589 Reserved the darker outline on header icons for accessibility only [#275](https://github.com/siteminder-au/sui/pull/275)
- SUI-603 Nested expandable card's arrow has incorrect position and content showing when closed [#281](https://github.com/siteminder-au/sui/pull/281)

##### Backward compatibility
- SUI-580 White labelling updates [#280](https://github.com/siteminder-au/sui/pull/280)

## sui-core@0.107.0 (16/Jun/21)
##### New Component
- NA

##### Minors and patches
- SUI-587 Select component Disabled options [#276](https://github.com/siteminder-au/sui/pull/276)
- SUI-595 Allow for a Nav Item Disabled State + Support Popover On a Menu Item [#277](https://github.com/siteminder-au/sui/pull/277)
- SUI-597 Add accessibility Addon for storybook [#266](https://github.com/siteminder-au/sui/pull/266)

##### Backward compatibility
- NA

## sui-core@0.106.11 (07/Jun/21)
##### New Component
- NA

##### Minors and patches
- SUI-592 Header navigation - add dropdown support to nav bar section [#262](https://github.com/siteminder-au/sui/pull/262)

##### Backward compatibility
- NA

## sui-core@0.106.10 (02/Jun/21)
##### New Component
- NA

##### Minors and patches
- SUI-484 Add sticky sidebar to aside [#261](https://github.com/siteminder-au/sui/pull/261)
- SUI-444 Tablet navigation - logo doesn't look like a menu button [99207a](https://github.com/siteminder-au/sui/commit/99207a78464e88980f666922d8d5625322862004)

##### Backward compatibility
- NA

## sui-core@0.106.9 (27/May/21)
##### New Component
- NA

##### Minors and patches
- Dialog Storybook updates [#diff](https://github.com/siteminder-au/sui/compare/v0.98.12...sui-core.v0.106.9)

##### Backward compatibility
- NA

## sui-core@0.106.8 (26/May/21)
##### New Component
- NA

##### Minors and patches
- SUI-562 SUI - Review Demand Plus reservations button is right aligned [#254](https://github.com/siteminder-au/sui/pull/254)
- SUI-578 Table hover background color - find solid colour to replace rgba [#b40882](https://github.com/siteminder-au/sui/commit/b4088268f9931ad2ea5435ec726d46e60eb0a2db)
- SUI-516 Advanced table - first column shadow removal [#254](https://github.com/siteminder-au/sui/pull/254)
- SUI-582 dialog as a service : alert dialog > confirmButtonType = warning should render a red button not yellow [#256](https://github.com/siteminder-au/sui/pull/256)

##### Backward compatibility
- Minor updates on Table gradient - Please add style to the outer body of the table component div style="position: relative; width: 100%;", Updated storybook example for the reference [example](https://sui.siteminder.systems/?path=/story/components-table--table-gradient)

## sui-core@0.106.6 (16/May/21)
##### New Component
- NA

##### Minors and patches
- SUI-567: Provide a slot for the empty help icon on the header [#252](https://github.com/siteminder-au/sui/pull/252)
- SUI-570: Small bug fixes for Upsell card [#252](https://github.com/siteminder-au/sui/pull/252)

##### Backward compatibility
- NA

## sui-core@0.106.5 (10/May/21)
##### New Component
- NA

##### Minors and patches
- SUI-554: SUI - Header - Incorrect background for the Header Nav bar [#diff](https://github.com/siteminder-au/sui/compare/v0.98.6...sui-core.v0.106.5)

##### Backward compatibility
- NA

## sui-core@0.106.4 (5/May/21)
##### New Component
- NA

##### Minors and patches [#241](https://github.com/siteminder-au/sui/pull/241)
- SUI-547: Header - font size update
- SUI-553 SUI - Reservation search results - overlapping column name headers when user scrolls to the right
- SUI-556 Nested list drag and drop component
- SUI-548 Sidebar navigation - sub heading style
- SUI-547 Header - font size update

##### Backward compatibility
- NA

## sui-core@0.106.3 (29/Apr/21)
##### New Component
- NA

##### Minors and patches [#239](https://github.com/siteminder-au/sui/pull/239)
- SUI-543 Select dropdown shadow not appearing
- SUI-550 Progress bar - manual transition time
- SUI-552 Offer event propagation setup for Tooltip
- SUI-551 Date-picker dates are showing incorrect
- SUI-544 Date-range component - Enabling/disabling end date range selection based on start date selection
- SUI-541 Datepicker - Date format
- SUI-529 EFG feedback on Retrix table

##### Backward compatibility
- NA

## sui-core@0.106.2 (21/Apr/21)
##### New Component
- Progress bar [#237](https://github.com/siteminder-au/sui/pull/237)

##### Minors and patches
- SUI-260 Model custom component [#dafe19](https://github.com/siteminder-au/sui/commit/dafe197ea77d442197ddbfd2aa5d89f23974983a)

##### Backward compatibility
- NA

## sui-core@0.106.1 (09/Apr/21)
##### New Component
- NA

##### Minors and patches
- SUI-537 UI issues of <sm-date-picker> in date range mode [#b2a91b](https://github.com/siteminder-au/sui/commit/b2a91b3e2463f01df87a455433545a8360a57bda)

##### Backward compatibility
- NA

## sui-core@0.105.3 (09/Apr/21)
##### New Component
- NA

##### Minors and patches
- NA

##### Backward compatibility
- SUI-502 Update node version and check jest.config setting  [#diff](https://github.com/siteminder-au/arch-packages/pull/269/files#diff-d6e5814afa7e747cc5d3a7bee36b94891b09be76d32cb5ad046e97dbd39ec256)

## sui-core@0.105.2 (31/Mar/21)
##### New Component
- NA

##### Minors and patches
- Date range picker fixes [#diff](https://github.com/siteminder-au/sui/compare/v0.95.1...sui-core.v0.105.2)

##### Backward compatibility
- NA

## sui-core@0.105.1 (19/Mar/21)
##### New Component
- NA

##### Minors and patches
- SUI-514 Update the position of property menu icon [#cf95ad](https://github.com/siteminder-au/sui/commit/cf95ad6eeb1a959b1cd97bd8e33cd08af0544ac2)
- SUI-534 Add target prop to sm-vertical-nav-item [#227]()
- SUI-531 Header component - logo size support [#2254ea](https://github.com/siteminder-au/sui/commit/2254eaf1cfe3b928b85b89de89ceb5e29a77184a)
- SUI-528 SUI Component for external links [#bddde2](https://github.com/siteminder-au/sui/commit/bddde2d79987b2b0ae3e0931f91b76554df67852)

##### Backward compatibility
- NA

## sui-core@0.104.0 (25/Mar/21)
##### New Component
- NA

##### Minors and patches
- SUI-504 A page title section in AppHeader
- SUI-518 Ability to add a tooltip icon to sm-date-picker, sm-select and sm-radio-group

##### Backward compatibility
- SUI-507 Ability to select/input time in sm-date-picker [#226](https://github.com/siteminder-au/sui/pull/226/files)
- Upgraded v-calendar plugin v1.x.x to v2.x.x to support new feature requested datetime.
- [v2.x.x](https://vcalendar.io/datepicker.html) has introduced a significant number of Backward compatibility. see   here [#migration-guide](https://vcalendar.io/changelog/v2.0.html#v2-0-0)
##### SUI Date Picker Conversion Guide:
- The mode prop has been repurposed to enable date and/or time selection : 'date' | 'dateTime' | 'time'
- Since the mode prop no longer can be used to select date ranges, use the is-range: Boolean prop to bind to date ranges.
- Multiple date selection mode has been deprecated
- Previously, you could only bind to Javascript dates. Now it is possible to bind directly to string and number date values without manual conversion by setting the type and mask properties of the model-config prop. [#see](https://vcalendar.io/datepicker.html)
- Update custom input slot bindings - inputProps prop has been deprecated. Instead, when you provide your own input slot, use inputValue and inputEvents slot prop.
- For date ranges, inputValue and inputEvents will provide their bindings within start and end sub-properties.
- New time mask tokens - New mask tokens have been added to support user time entry. When providing your own input element as a default slot, use the masks props masks.input

## sui-core@0.103.2 (11/Mar/21)
##### New Component
- NA

##### Minors and patches [#224](https://github.com/siteminder-au/sui/pull/224)
- SUI-505 Use v-if for expandedRow to improve the performance of sm-table-tr
- SUI-503 Inconsistent class name in AppHeader
- SUI-506 Ability to add a tooltip icon to sm-input
- SUI-497 sm-wizard - confirm button icon

##### Backward compatibility
- NA

## sui-core@0.103.1 (04/Mar/21)
##### New Component
- NA

##### Minors and patches
- SUI-515 Wizard v-show/v-if [#diff](https://github.com/siteminder-au/sui/compare/v0.94.0...sui-core.v0.103.1)

##### Backward compatibility
- NA

## sui-core@0.103.0 (03/Mar/21)
##### New Component
- NA

##### Minors and patches [#diff](https://github.com/siteminder-au/sui/pull/218)
- SUI-500 Clicking disabled buttons in the empty room type or rate plan page redirects to error page
- SUI-495 The sm-nav close button in wrong position [#217](https://github.com/siteminder-au/sui/pull/217)
- SUI-479 On Firefox - when entering a decimal value in the price input field , a red border (error indicator) displayed with message
- SUI-496 updates docs for header for tablet navigation
- SUI-494 Inline card - update storybook example

##### Backward compatibility
- NA

### Release page to review older releases [here](https://github.com/siteminder-au/sui/releases)
