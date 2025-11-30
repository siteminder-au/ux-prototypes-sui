# Changelog
All notable changes to the vue3 build will be documented in this file.

<!--
please use the following format for the changelog.
changes should be categorised relative to the previous version.
Some examples:
- if it's a new component that didn't exist in the previous version, it will be a minor change.
- if it's renaming/deleting a prop or changing the behaviour of a component relative to the previous version, it will be a breaking change.

## sui-core@<version>-vue3
### Breaking changes
- (component) short description [#123](github link)

### Minors & Patches
- (component) short description [#123](github link)

### Internal
- (component) short description [#123](github link)
-->

---

# vue3 migration guide
- Visit [this wiki](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2874738702/SUI+How+to+upgrade+to+vue3+Upgrade+step#Upgrade-to-vue3-sui-core-build) for a detailed breakdown of code changes you need to make to consume each sui-core component in the vue3 sui-core build.
- If you are looking for what components are readily available in the vue3 sui-core build, see [vue3 storybook](https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/)

# Releases
## sui-core@23.4.0-vue3
### Minors & Patches
- (sm-content-slider) Updated image background to transparent [#1430](https://github.com/siteminder-au/sui/pull/1430/)
- (sm-lazy-image) Updated `border-radius` to inherit from parent [#1430](https://github.com/siteminder-au/sui/pull/1430/)
- (sm-media) Added `is-invalid` prop to apply red border [#1430](https://github.com/siteminder-au/sui/pull/1430/)
- (sm-media-item) Updates and features [#1430](https://github.com/siteminder-au/sui/pull/1430/) [#1432](https://github.com/siteminder-au/sui/pull/1432)
  - Added `footer` and `left-action` slots
  - Added `always-show-left-action` prop to conditionally display the slot even without hovering
- (sm-tooltip) Fixed default tooltip arrow opacity [#1430](https://github.com/siteminder-au/sui/pull/1430/)

## sui-core@23.3.0-vue3
### Minors & Patches
- (sm-time-picker) Add `label`, `action`, `prefix` and `suffix` slots for the component [#1425](https://github.com/siteminder-au/sui/pull/1425)
- (sm-button) Fix bottom spacing issue for square and round shapes [#1425](https://github.com/siteminder-au/sui/pull/1425)
  - This change may affect the layout and placement in components that use these button variants, including sm-banner, sm-content-slider, sm-dropdown, sm-pagination, sm-toast, and others, as these variants are widely used across components.

## sui-core@23.2.0-vue3
### Minors & Patches
- (sm-notification-list) Support visual distinction between actionable (clickable) and non-actionable notification items [#1417](https://github.com/siteminder-au/sui/pull/1417)
  - Introduced `isActionable` prop for `SmNotificationListItem` to control item interactivity and styling

## sui-core@23.1.0-vue3
### Minors & Patches
- (sm-notification-list, sm-text-truncator) Fix click event propagation issues [#1415](https://github.com/siteminder-au/sui/pull/1415)
  - Ensure `click-list-item` is emitted when clicking on the description
  - Prevent the "Read more / Read less" button from triggering parent click events
- (sm-text-truncator) Co-locate button icon to ensure correct rendering inside web components [#1416](https://github.com/siteminder-au/sui/pull/1416)

## sui-core@23.0.0-vue3
### Minors & Patches
- (sm-button) Co-locate the sui-themes theming tokens [#1405](https://github.com/siteminder-au/sui/pull/1405)
- (sm-dropdown) Expose `SmDropdownPlacement` and `SmDropdownPosition` types [#1409](https://github.com/siteminder-au/sui/pull/1409)
- (sm-checkbox, sm-checkbox-button) Add keyboard interaction [#1410](https://github.com/siteminder-au/sui/pull/1410)
- (sm-notification-list) Support truncating long notification descriptions [#1411](https://github.com/siteminder-au/sui/pull/1411)
  - Use `sm-text-truncator` to collapse long text with a "Show more / Show less" toggle
  - Expose `showMoreText` and `showLessText` props for customization

## sui-core@22.7.0-vue3
### Minors & Patches
- (sm-table) Update disabled state styles for `sm-table-td` [#1400](https://github.com/siteminder-au/sui/pull/1400)
- (sm-popover) Update `appendToBody` styles [#1401](https://github.com/siteminder-au/sui/pull/1401)
  - Set content `pointer-events` to `all` when `appendToBody` is true
  - Enable transitions when `appendToBody` and `isTransition` props are set to true

## sui-core@22.6.0-vue3
### Minors & Patches
- (sm-popover) Add `appendToBody` prop to allow it to be rendered outside of its parent container [#1393](https://github.com/siteminder-au/sui/pull/1393)

## sui-core@22.5.0-vue3
### Minors & Patches
- (sm-calendar) Add `locale` prop to localize the displayed month names [#1392](https://github.com/siteminder-au/sui/pull/1392)
- (sm-checkbox, sm-radio, sm-multi-select) Fix jittery transitions [#1392](https://github.com/siteminder-au/sui/pull/1392)
- (sm-loading-spinner) Various updates [#1394](https://github.com/siteminder-au/sui/pull/1394)
  - UI tweaks and a11y fixes
  - Add `ariaLoadingMessage` prop to allow customers to customize the screen reader message
  - Expose the typings

## sui-core@22.4.0-vue3
- (sm-loading-spinner) new component [#1380](https://github.com/siteminder-au/sui/pull/1380)

## sui-core@22.3.0-vue3
### Minors & Patches
- (sm-user-menu) Add `open` and `close` events [#1387](https://github.com/siteminder-au/sui/pull/1387)

## sui-core@22.2.0-vue3
### Minors & Patches
- (sm-notification-list) New prop and various updates [#1381](https://github.com/siteminder-au/sui/pull/1381)
  - Title will always look like an `h6` regardless of the element that is configurable via `titleTag`
  - Property label will be standardized to UPPERCASE
  - Add new `header-config` prop which accepts `edge-to-edge` property to be set to remove the padding-left and padding-right of the header
  - Don't show the list anymore when `has-error` is set to `true`

## sui-core@22.1.0-vue3
### New component
- (sm-notification-list) Introduction of new component to support notifications [#1348](https://github.com/siteminder-au/sui/pull/1348)
  - This also introduces dependency to Intersection Observer API which may need mocking on Jest environment

### Minors & Patches
- (General) CommonJS support is now built-in, so there's no need for consumers to manually configure `jest.config.js` to handle `.mjs` files. [#1361](https://github.com/siteminder-au/sui/pull/1361)
  ```js
  // Not needed anymore
  moduleNameMapper: {
    '^@siteminder/sui-core$': '<rootDir>/node_modules/@siteminder/sui-core/sui-core.mjs',
    '^@siteminder/sui-core/components/(.*)$': '<rootDir>/node_modules/@siteminder/sui-core/components/$1.mjs',
    '^@siteminder/sui-core/libs$': '<rootDir>/node_modules/@siteminder/sui-core/libs.mjs',
    '^@siteminder/sui-core/services$': '<rootDir>/node_modules/@siteminder/sui-core/services.mjs',
  },
  ```
- (sm-switch-group) Update the border-bottom color to use the official SUI color [#1363](https://github.com/siteminder-au/sui/pull/1363)
- (sm-multi-select) Update the `pt` "Select all" options translation text [#1377](https://github.com/siteminder-au/sui/pull/1377)


## sui-core@22.0.1-vue3
### Minors & Patches
- (sm-tab) Fix clicking sm-tabs in a form and triggering submit issue [#1356](https://github.com/siteminder-au/sui/pull/1356)

## sui-core@22.0.0-vue3
### Breaking changes
- (sm-banner) See relevant [sui-themes changes](https://github.com/siteminder-au/sui/blob/vue3/libs/sui-themes/CHANGELOG.vue3.md#breaking-changes)

### Minors & Patches
- (sm-switch, sm-switch-group) New props and fixes [#1347](https://github.com/siteminder-au/sui/pull/1347)
  - Added `layout` prop to `sm-switch` to include a horizontal variant of the label and toggle
  - Added `label-hidden` prop to `sm-switch` to remove the `label` element
  - Added missing focus ring to the `sm-switch` toggle when accessed via keyboard tab
  - Added `has-border` prop to `sm-switch-group`
    - No `sui-themes` token support at this point
- (sm-banner) Fix close button overlapping with the content [#1351](https://github.com/siteminder-au/sui/pull/1351)
  - See `sui-themes@22.0.0-vue3` for relevant updates

## sui-core@21.3.0-vue3
### New component
- (sm-hint-card) New component to give hint or to convey an upsell message [#1342](https://github.com/siteminder-au/sui/pull/1342)

## sui-core@21.2.2-vue3
### Minors & Patches
- (sm-time-picker, sm-translations-input, sm-color-picker, sm-pagination) Fix unexpected behavior in local component registration in downstream projects by importing `sm-select` and `sm-button` internally [#1336](https://github.com/siteminder-au/sui/pull/1336)
  - This changes the compiled CSS files for `sm-select` and its subcomponents, as they have been split into different files.
  - *SUGGESTED FIX*: If you are importing CSS files directly, adjust your imports accordingly.

## sui-core@21.2.1-vue3
- (sm-media) Add built-in paddings and max-width for the `empty` slot [#1330](https://github.com/siteminder-au/sui/pull/1330)

## sui-core@21.2.0-vue3
- NA

## sui-core@21.1.0-vue3
### New component
- (sm-input-suffix-button) New sm-input-suffix-button mixed input component [#1322](https://github.com/siteminder-au/sui/pull/1322)
  - Introduction of new mixed input component that adds a new type of button at the input suffix slot
  - Does not use the sm-button component to avoid adding another button type with $app-info-light background color

## sui-core@21.0.0-vue3
### Breaking changes
- (sm-checkbox) Validation, emitted events and accessibility updates [#1318](https://github.com/siteminder-au/sui/pull/1318)
  - Remove the duplicated `model-value` updates
  - Remove the duplicated and invalid `role="checkbox"` and `aria-checked` attributes from the built-in `label` element
    - *SUGGESTED FIX*: Adjust the any relevant test selectors like `getByRole('checkbox')` if needed since it was returning double the actual number before

### Minors & Patches
- (sm-checkbox) General fixes and updates [#1314](https://github.com/siteminder-au/sui/pull/1314) [#1318](https://github.com/siteminder-au/sui/pull/1318)
  - Add number, boolean and object types to the accepted `selected-value` and `model-value` props
  - Fix `indeterminate` prop reactivity [#1318](https://github.com/siteminder-au/sui/pull/1318)
  - Fix the checked state when `selected-value` is an object
- (sm-radio) General fixes and updates [#1314](https://github.com/siteminder-au/sui/pull/1314) [#1318](https://github.com/siteminder-au/sui/pull/1318)
  - Add number, boolean and object types to the accepted `selected-value` and `model-value` props
  - Fix the checked state when `selected-value` is an object

## sui-core@20.0.0-vue3
### Breaking changes
- (General) Update peer dependency `vue@~3.4.38` [#1309](https://github.com/siteminder-au/sui/issues/1309)
  - See [official Vue 3.4 changelog](https://github.com/vuejs/core/blob/main/changelogs/CHANGELOG-3.4.md) for more details.
  - (sm-date-picker) If you are using `@vue/compat` build and is consuming the `mode="dateTime"` or `mode="time"` of the component, you'll need to set this extra flag after upgrading the FE's Vue version:
    ```ts
    configureCompat({
      COMPONENT_V_MODEL: false, // Already flagged in v9.0.0-vue3 release
      ATTR_FALSE_VALUE: false, // New
    })
    ```

### Minors & Patches
- (sm-calendar) Fix the field validation behaviour issues caused by the `vue@3.4.38` upgrade

### Internal
- (General) Update devDependencies around testing and linting [#1309](https://github.com/siteminder-au/sui/issues/1309)

## sui-core@19.0.0-vue3
### Breaking changes
- (sm-dialog) Renamed theming token `--sm-c-dialog-max-height` to `--sm-c-dialog-min-height` for consistency with the property being set [#1286](https://github.com/siteminder-au/sui/pull/1286)
- (sm-app-header) The theming token `--sm-c-app-header-top-bar-color-background` has higher precedence over the white-labelling token `--secondary-background`
  - Normally, the white-labelling token has higher precedence except for this token since the setup is different between the two, where
  the theming token can be a gradient, as opposed to the white-labelling where the expected value is solid and the gradient setup is pre-determined
  - *SUGGESTED FIX*: Don't use both white-labelling and theming tokens to set the background color of the app-header, or any other token for that matter

### Minors & Patches
- Co-locate the sui-themes theming tokens in the following:
  - sm-dialog [#1286](https://github.com/siteminder-au/sui/pull/1286)
  - sm-help-card [#1286](https://github.com/siteminder-au/sui/pull/1286)
  - sm-loading-bar and all other sm-loading-* components using it [#1286](https://github.com/siteminder-au/sui/pull/1286)
  - sm-badge [#1301](https://github.com/siteminder-au/sui/pull/1301)
    - Updated the info type background mapping from `--color-primary` to `--color-info`
  - sm-app-header [#1298](https://github.com/siteminder-au/sui/pull/1298)
  - sm-app-header-link [#1298](https://github.com/siteminder-au/sui/pull/1298)
  - sm-horizontal-nav/sm-horizontal-nav-item [#1298](https://github.com/siteminder-au/sui/pull/1298)
  - sm-user-menu [#1298](https://github.com/siteminder-au/sui/pull/1298)
  - sm-property-menu [#1298](https://github.com/siteminder-au/sui/pull/1298)
  - sm-user-list/sm-user-list-item [#1298](https://github.com/siteminder-au/sui/pull/1298)
  - sm-vertical-nav/sm-vertical-nav-item tokens under sm-app-header [#1298](https://github.com/siteminder-au/sui/pull/1298)
  - sm-nav/sm-nav-item [#1298](https://github.com/siteminder-au/sui/pull/1298)

### Internal
- (All) Node v20 upgrade

## sui-core@18.0.1-vue3
### Minors & Patches
- (sm-user-menu) Fix the hover and focused state of the icon and label for white-labelling and sui-themes [#1295](https://github.com/siteminder-au/sui/pull/1295)

## sui-core@18.0.0-vue3
### Breaking changes
- (sm-app-header) Refactor to use flexbox and changes are made in the HTML structure and CSS class names [#1289](https://github.com/siteminder-au/sui/pull/1289)
  - Any direct references to these class names will likely break:
    - `sm-app-header--has-notification`
    - `sm-app-header--has-app-switcher`
    - `sm-app-header--has-help`
    - `sm-app-header__help--has-notification`
    - `sm-app-header__app-switcher--help`
    - `sm-app-header__app-switcher--notification`
  - The following variables are no longer exposed via template refs:
    - `propertyMenu`
    - `propertyMenuWidth`
    - `setPropertyMenuWidth`
- (sm-user-menu, sm-property-menu) Refactor the HTML structure by adding a button as a space occupier to prevent adjacent elements from moving when button is expanded [#1289](https://github.com/siteminder-au/sui/pull/1289)
  - Update styles to work with `sm-app-header`'s flexbox approach

### Minors & Patches
- (Multiple) Replace border-bottom-width with box-shadow when in focused state [#1290](https://github.com/siteminder-au/sui/pull/1290)
  - `sm-calendar`
  - `sm-color-picker`
  - `sm-date-picker`
  - `sm-input`
  - `sm-multi-select`
  - `sm-select`
  - `sm-translations-input`

## sui-core@17.0.0-vue3
### Breaking changes
- (sm-color-picker) Change the third-party plugin from `@lk77/vue3-color` to `@ckpack/vue-color` [#1274](https://github.com/siteminder-au/sui/pull/1274)
  - This fixes the compile error when used standalone Vue3 webapp using Webpack (non-`@vue/compat` build)

### Minors & Patches
- (sm-list, sm-media) Fix the compile error when used standalone Vue3 webapp using Webpack (non-`@vue/compat` build) [#1274](https://github.com/siteminder-au/sui/pull/1274)
- (sm-list-item) Remove the overflowing numbered list marker in Safari [#1274](https://github.com/siteminder-au/sui/pull/1274)
- (sm-form-group) Fix `sm-form-group` overflowing content
  - Particularly, when used with `sm-select` with long label, it will prevent the component from overflowing from the container
  - Note that the custom CSS, e.g. flex boxes, within the `sm-form-group` default slot can still affect the shrinking/wrapping/overflowing behaviour of the elements.

## sui-core@16.1.0-vue3
### New component
- (sm-multi-select) Migrate the component to Vue3 [#1258](https://github.com/siteminder-au/sui/pull/1258)
  - This won't have the exact same structure as the Vue2 counterpart and should be treated as a new component in Vue3. Some notable updates:
    - Updated ARIA roles and attributes
      - `role="combobox"` is now labelled
      - Action is now attached to `role="option"` which makes it possible for `getByRole('option', { name: 'Option 1' })` (and similar test selectors) to be clicked. Previously you can only click by querying by the option text
    - Selected theming tokens are now co-located inside the component
    - Like the other form components, the `name` prop is required
    - `sm-tag-filters` subcomponent migration is not part of this release, which
    means relevant props and events are not available: `tags` prop and `@update:tags` event

### Minors & Patches
- (sm-table) Fix issue wherein the background-color of the row in selected state is not showing. [#1257](https://github.com/siteminder-au/sui/pull/1257)
- (sm-loading-home-screen) Introduce `showHeader` prop to change the visibility of the header nav loader. [#1266](https://github.com/siteminder-au/sui/pull/1266)
- (sm-loading-*) Explicitly import dependency components into the loading components [#1269](https://github.com/siteminder-au/sui/pull/1269)

## sui-core@16.0.0-vue3
### Breaking changes
- (sm-date-picker) Renamed `suffx` slot name to `suffix` to fix typo. Consumers will need to update the slot name in their implementations. [#1248](https://github.com/siteminder-au/sui/pull/1248)
- (sm-horizontal-nav-item) move `sm-horizontal-nav-item--active` and `sm-horizontal-nav-item--exact-active` classes at the li parent container. This is to ensure active styles work when component is used without vue-router [#1247](https://github.com/siteminder-au/sui/pull/1247/files)
  - *SUGGESTED FIX*: remove any style overrides that target the `sm-horizontal-nav-item--active` and `sm-horizontal-nav-item--exact-active` classes.

### Minors & Patches
- (sm-select, sm-app-header, sm-nav, sm-property-menu) co-locate icons to some components, so icons render correctly inside a web component without registering sm-icon from @siteminder/sui-icons. Also, it allows downstream projects to use these components without installing @siteminder/sui-icons. NOTE: there are still other components that references sm-icon which still requires @siteminder/sui-icons installed. [#1244](https://github.com/siteminder-au/sui/pull/1244/files)
- (general) add :host to base styles to ensure that the styles are applied to the web component's shadow DOM. [#1244](https://github.com/siteminder-au/sui/pull/1244/files)
- (general) make sm-icon styles available in some components that have inline icons. [#1244](https://github.com/siteminder-au/sui/pull/1244/files)
- (sm-user-menu, sm-property-menu) use onClickOutside from vueuse to ensure popover elements work correctly in a web component. [#1247](https://github.com/siteminder-au/sui/pull/1247/files)
- (sm-pagination) Added dynamic value of `size` attribute for instances of `sm-input` [1251](https://github.com/siteminder-au/sui/pull/1251)
- (sm-date-picker) Fix issue wherein the input field cannot be typed into [#1250](https://github.com/siteminder-au/sui/pull/1250)
- (sm-tag) Expose `SmTagType` and `SmTagSize` types [#1250](https://github.com/siteminder-au/sui/pull/1250)
- (sm-horizontal-nav-item, sm-vertical-nav-item) Suppress ATTR_FALSE_VALUE compat warnings since `false` is a valid value for `aria-expanded`

## sui-core@15.0.0-vue3
### Breaking changes
- (All) Make CSS tree shakeable [#1212](https://github.com/siteminder-au/sui/pull/1212)
  - We will be deprecating `@siteminder/sui-core/sui-core.esm.css` soon in favour of `@siteminder/sui-core/sui-global.css`
  - `@siteminder/sui-core/sui-global.css` only contains SUI global styles. For example: typography, reset, and other base global styles. All other components styles are CSS tree-shakeable.
    - Renamed `sui-common.css` to `sui-global.css` [#1222](https://github.com/siteminder-au/sui/pull/1222)
  - CSS is now split and injected into each entry. Meaning only necessary CSS will be included in the final bundle.
  - CSS stub is now required for running Jest. Please see goldeneye for [an example](../../frontends/goldeneye/test/css-stub.js).

- (All) Add better exposure of types for components [#1242](https://github.com/siteminder-au/sui/pull/1242)
  - Jest moduleNameMapper config needs to be updated to correctly resolve sui-core module path references:
  - *SUGGESTED FIX*:
    ```ts
    // jest.config.(js|cjs)
    moduleNameMapper: {
      ...
      // we need to tell jest how to resolve sui-core imports
      '^@siteminder/sui-core$': '<rootDir>/node_modules/@siteminder/sui-core/sui-core.mjs',
      '^@siteminder/sui-core/components/(.*)$': '<rootDir>/node_modules/@siteminder/sui-core/components/$1.mjs',
      '^@siteminder/sui-core/libs$': '<rootDir>/node_modules/@siteminder/sui-core/libs.mjs',
      '^@siteminder/sui-core/services$': '<rootDir>/node_modules/@siteminder/sui-core/services.mjs',
    },
    ```

- (White-labelling) The `white-labelling.css` file is no longer exported by the library [#1243](https://github.com/siteminder-au/sui/pull/1243)
  - *SUGGESTED FIX*: Remove the explicit import. The white-labelling tokens will still work since they are now mapped inside the relevant SUI components that supports it. See relevant changes below for more details.
- (sm-app-header) Merge white-label CSS with vue component. Removed `!important` from the white-label CSS [#1212](https://github.com/siteminder-au/sui/pull/1212) [#1219](https://github.com/siteminder-au/sui/pull/1219)
  - White labelling variables will now take precedence over sui-theme CSS.
- (sm-property-menu) Merge white-label CSS with vue component. [#1224](https://github.com/siteminder-au/sui/pull/1224)
  - White labelling variables will now take precedence over sui-theme CSS.
- (sm-user-menu) Merge white-label CSS with vue component. [#1237](https://github.com/siteminder-au/sui/pull/1237)
  - White labelling variables will now take precedence over sui-theme CSS.
- (sm-user-list-item) Merge white-label CSS with vue component. [#1227](https://github.com/siteminder-au/sui/pull/1227)
  - White labelling variables will now take precedence over sui-theme CSS.
- (general) Projects using sui-themes package may find some CSS variables are not applied any more. This is because the white labelling CSS variables now take precedence over the sui-theme CSS variables.
  *SUGGESTED FIX*: update the CSS file that contains your sui-themes CSS variable overrides and set the white labelling CSS variables. For example:
  ```css
  :root {
    --secondary-background: #000000;
    --secondary-foreground: #FFFFFF;
    --tertiary-background: #FEF8F3;
    --tertiary-foreground: #000000;
    --primary-background: #FF6842;
    --primary-foreground: #F8EFE7;

    ...other sui-themes variables here
  }
  ```
- (sm-horizontal-nav-item) Introduced `forceActiveState` prop [#1234](https://github.com/siteminder-au/sui/pull/1234)
  - Removed `handleIsActive` method
  - Modified class binding for active state
  - Update forceActiveState enum type to `SmHorizontalNavItemActiveState` [#1242](https://github.com/siteminder-au/sui/pull/1242)
- (sm-user-list-item) Updated styles to make it responsive and truncate content after two lines [#1220](https://github.com/siteminder-au/sui/pull/1220)
  - The updated CSS deprecates --sm-c-user-list-date-right from the sui-themes library
- (sm-vertical-nav-item) Update forceActiveState enum type to `SmVerticalNavItemActiveState` [#1242](https://github.com/siteminder-au/sui/pull/1242)

### Minors & Patches
- (General) Make the global styles tree-shakeable
  - Importing the all inclusive `sui-global.css` is still the recommended approach. However, if you need to exclude some styles, these new exports are now available [#1232](https://github.com/siteminder-au/sui/pull/1232):
    - `@siteminder/sui-core/sui-common.css`
    - `@siteminder/sui-core/sui-resets.css`
    - `@siteminder/sui-core/sui-scaffolding.css`
    - `@siteminder/sui-core/sui-typography.css`
    - `@siteminder/sui-core/sui-utilities.css`
  - At this point, it is not recommended to omit them as it can lead to missing styles which are required for the components to work correctly. If used, you'll have to correct the styles via CSS overrides
- (sm-vertical-nav-item) Removed `router-link` dependency when `to` prop is not used [#1209](https://github.com/siteminder-au/sui/pull/1209)
- (sm-app-header-link) Removed `router-link` dependency when `to` prop is not used [#1210](https://github.com/siteminder-au/sui/pull/1210)
- (sm-vertical-nav/sm-vertical-nav-item) Merge relative white-label CSS in the vue component.[#1221](https://github.com/siteminder-au/sui/pull/1221)
- (sm-vertical-nav-item) Remap the second-level list dot indicator to the `--primary-background` variable [#1226](https://github.com/siteminder-au/sui/pull/1226)
- (sm-aside) Cleanup white-labelling file since it's not mapping any variable to the component [#1226](https://github.com/siteminder-au/sui/pull/1226)
- (sm-horizontal-nav/sm-horizontal-nav-item) Merge white-label CSS in the relative vue component. [#1231](https://github.com/siteminder-au/sui/pull/1231)
- (sm-nav-item) Removed `router-link` dependency when `to` prop is not used [#1228](https://github.com/siteminder-au/sui/pull/1228)
- (sm-nav-item) Expose `SmNavItemActiveState` enum type [#1242](https://github.com/siteminder-au/sui/pull/1242)
- (sm-toast) Expose `SmToastType`, `SmToastPlacement` enum types [#1242](https://github.com/siteminder-au/sui/pull/1242)
- (sm-vertical-nav-item) Expose `SmVerticalNavItemActiveState` enum type [#1242](https://github.com/siteminder-au/sui/pull/1242)
- (sm-horizontal-nav-item) Expose `SmHorizontalNavItemActiveState` enum type [#1242](https://github.com/siteminder-au/sui/pull/1242)

### Internal
- (All) Move to @stylistic formatting for Eslint and fix all issues [#1215](https://github.com/siteminder-au/sui/pull/1215)

## sui-core@14.1.0-vue3
### Minors & Patches
- (sm-horizontal-nav-item) Removed `router-link` dependency when `to` prop is not used [#1198](https://github.com/siteminder-au/sui/pull/1198)
- (sm-select) Added a new translation key to represent list is empty state when no elements in options. [#1203](https://github.com/siteminder-au/sui/pull/1203)
- (sm-aside) Fix `vue/no-multiple-objects-in-class` eslint violation by restructuring class object [#1202](https://github.com/siteminder-au/sui/pull/1202)
- (sm-card-brand-graphic) Remove `background-image` style from being attached if there is no `imageSrc` prop provided [#1202](https://github.com/siteminder-au/sui/pull/1202)
- (sm-dropdown) Remove deprecated `.native` modifier on `v-on` click directive [#1202](https://github.com/siteminder-au/sui/pull/1202)
- (sm-radio-group) Add `aria-labelledby` to the group to reference the label prop or slot and improve the accessibility [#1202](https://github.com/siteminder-au/sui/pull/1202)
- (sm-radio) Remove invalid `aria-checked` and `aria-disabled` from the label element to fix accessibility violation [#1202](https://github.com/siteminder-au/sui/pull/1202)
  - These accessibility properties should be available to the `<input role="radio">` element by default
- (sm-toast) Fix `miniInfo` prop type: from `false` to `boolean` [#1202](https://github.com/siteminder-au/sui/pull/1202)
- (All) Added translations file for all vue3 components in 7 different languages [#1205](https://github.com/siteminder-au/sui/pull/1205). Please find the list of the components that has noticeable updates:
  - sm-loader - Added new key for loading
  - sm-carousel - Added button labels
  - sm-text-truncator - button labels
  - sm-translations-input - Added new key for delete button
  - Vee-validation - Updated key names as per the latest vee-validation version[here](https://vee-validate.logaretm.com/v4/guide/i18n/)

## sui-core@14.0.0-vue3
### Breaking changes
- (sm-slider) Rename `SliderType` and `SliderValue` types to `SmSliderType` and `SmSliderValue` for consistency across the library [#1197](https://github.com/siteminder-au/sui/pull/1197)

### Minors & Patches
- (sm-select) Make `code` and `label` properties in `options` prop optional to fix typings in `show-group-select` (grouped options) variant [#1197](https://github.com/siteminder-au/sui/pull/1197)
- (sm-calendar) Remove `type` keyword from `SmCalendarMode`, `SmCalendarPlacement`, `SmCalendarPosition`, `SmCalendarRangePart` and `SmCalendarView` enums to fix runtime issue [#1197](https://github.com/siteminder-au/sui/pull/1197)
- (sm-slider) Remove `type` keyword from `SmSliderType` enum to fix runtime issue [#1197](https://github.com/siteminder-au/sui/pull/1197)
- (sm-user-list) Remove `type` keyword from `SmUserListItemType` enum to fix runtime issue [#1197](https://github.com/siteminder-au/sui/pull/1197)

## sui-core@13.0.1-vue3
### Minors & Patches
- (sm-select) Enable type checking and fix issues [#1178](https://github.com/siteminder-au/sui/pull/1178)
- Replace soft deprecated `::v-deep` selector with the new `:deep` selector to resolve warnings for the following [#1180](https://github.com/siteminder-au/sui/pull/1180):
  - sm-calendar
  - sm-dialog
  - sm-slider

## sui-core@13.0.0-vue3
### Breaking changes
- Cleanup unused files, variables and references to the following deprecated components [#1153](https://github.com/siteminder-au/sui/pull/1153):
  - sm-connector - Deprecated in `sui-core@3.0.0` (Vue2)
  - sm-field-clear - Deprecated in `sui-core@3.0.0` (Vue2)
  - sm-lottie-player - Deprecated in `sui-core@4.0.0` (Vue2)
  - sm-side-panel - Deprecated in `sui-core@3.0.0` (Vue2)
    - Including translation files
  - sm-skip-link - Deprecated in `sui-core@3.0.0` (Vue2)
  - sm-multi-select - Never ported since `sui-core@9.0.0-vue3`
    - Including translation files
  - sm-tag-filters - Never ported since `sui-core@9.0.0-vue3`
    - Including translation files
- (composables) Removed the following [#1153](https://github.com/siteminder-au/sui/pull/1153):
  - useBreakpoints
  - useEventProxy
  - getParentComponent
  - useMediaQuery
  - useResizeObserver
- (sm-404-page) Remove CSS overrides in `.sm-lottie-player` [#1153](https://github.com/siteminder-au/sui/pull/1153)

### Minors & Patches
- Enable type checking and fix issues in the following components [#1169](https://github.com/siteminder-au/sui/pull/1169)
  - sm-form
  - sm-time-picker
  - sm-app-header-link
  - sm-carousel/sm-carousel-slide
  - sm-dropdown
  - sm-horizontal-nav-item
  - sm-lazy-image
  - sm-media-item
  - sm-nav-item
  - sm-slider/sm-slider-bar/sm-slider-tooltip
  - sm-tabs/sm-tab
  - sm-toast
  - sm-vertical-nav-item

### Internal
- (Multiple) Replace explicit `modelValue` props with `defineModel` macro on the following components [#1150](https://github.com/siteminder-au/sui/pull/1150)
  - `sm-checkbox-button`
  - `sm-checkbox`
  - `sm-date-picker`
  - `sm-input`
  - `sm-radio-button`
  - `sm-radio`
  - `sm-select`
  - `sm-switch`
- (Multiple) Replace `useSlots` composable with `defineSlots` macro on the following components [#1150](https://github.com/siteminder-au/sui/pull/1150)
  - `sm-app-header`
  - `sm-nav-item`
  - `sm-popover`
  - `sm-vertical-nav-item`
  - `sm-vertical-nav-section`


## sui-core@12.0.0-vue3
### Breaking changes
- (general) Update peer dependency `vue@~3.4.19`. Remove vue-demi references. Add better type support by generating declaration files (.d.ts) for all .ts and .vue files. [#1151](https://github.com/siteminder-au/sui/pull/1151)

### Minors & Patches
- (general) Ported the following components to vue3:
  - sm-breadcrumbs
  - sm-user-list
  - sm-html-truncator
  - sm-translations-input
  - sm-time-picker
  - sm-content-slider
  - Visit [this wiki](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2874738702/SUI+How+to+upgrade+to+vue3+Upgrade+step#Upgrade-to-vue3-sui-core-build) to see how to migrate from vue2 to vue3 for these components
- (sm-select) Trigger validation on blur [#1134](https://github.com/siteminder-au/sui/pull/1134)
  - Also fixes validation when a `null` value option is first selected from an empty state, e.g. `{ label: 'Please choose', code: null }`

## sui-core@11.0.0-vue3
### Breaking changes
- (general) Update peer dependency `vue@~3.4.15`.
- (general) Add sui-core.mjs, sui-core.css files as part of the bundle files.
- (general) We now bundle the following third party libraries:
  - fecha
  - lodash-es
  - vue-multiselect
  - @popperjs/core
- (general) Bundle files and dependencies above are not transpiled to ES5 any more as modern browsers now support ES6 and beyond. Build tooling has been configured to now transpile sui-core code to ES2022, which is more concise, more performant and leads to lower bundle sizes.
  - See [caniuse](https://caniuse.com/?search=es2022) for browser support for ES2022.

### Minors & Patches
- (general) Ported the following components to vue3:
  - sm-inline-card
  - sm-progress-bar
  - sm-slider
  - sm-drawer
  - sm-calendar
  - sm-color-picker
  - sm-controller
    - Visit [this wiki](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2874738702/SUI+How+to+upgrade+to+vue3+Upgrade+step#Upgrade-to-vue3-sui-core-build) to see how to migrate from vue2 to vue3 for these components
- (sm-calendar) Address validation issues [#1278](https://github.com/siteminder-au/sui/pull/1278)
  - sm-form's values slot prop and the calendar’s v-model is not in sync which causes validation issues because the library tries to validate both the internal model value (an object) and the user's input (a string):
    - sm-calendar formats to `{{{ month: number, year: number }}}`
    - sm-form’s values slot prop formats to the display text, e.g. `October 2024`
  - Workaround:
    - Introduced separate fields for the raw input values (`calendar-range-start-input` and `calendar-range-end-input`) to track the user's input separately from the structured data.
    - The form state is initialized with both the internal model structure and the raw input values to avoid conflicts during validation.
  - Previous implementation:
    ```javascript
    const initialValue = {
      calendar: { month: 1, year: 2023 },
      'calendar-range': {
        start: { month: 1, year: 2023 },
        end: { month: 12, year: 2023 },
      },
    }

    const form = ref(initialValue)
    ```
  - Updated implementation:
    ```javascript
    const initialValue = {
      calendar: 'January 2023',
      'calendar-range-start-input': 'January 2023',
      'calendar-range-end-input': 'December 2023',
      'calendar-range': {
        start: { month: 1, year: 2023 },
        end: { month: 12, year: 2023 },
      },
    }

    const form = ref({
      calendar: { month: 1, year: 2023 },
      'calendar-range': {
        start: { month: 1, year: 2023 },
        end: { month: 12, year: 2023 },
      },
    })
    ```

## sui-core@10.0.0-vue3
### Breaking changes
- (general) Update peer dependency `vue@~3.4.14`. See [vue blog post](https://blog.vuejs.org/posts/vue-3-4) for migration steps.
- (sm-loading-form) Remove Tailwind classes from the component

### Minors & Patches
- (general) Ported the following components to vue3:
  - sm-accordion
  - sm-lazy-image
  - sm-list-*
  - sm-toast
  - sm-horizontal-nav-*
  - sm-wizard-*
  - sm-text-truncator
  - sm-popover
  - sm-property-menu
  - sm-section
    - Visit [this wiki](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2874738702/SUI+How+to+upgrade+to+vue3+Upgrade+step#Upgrade-to-vue3-sui-core-build) to see how to migrate from vue2 to vue3 for these components

## sui-core@9.1.0-vue3
### Minors & Patches
- (sm-form) Ensure `initial-values` prop is passed to sm-form in order for form reset to work properly.
- (sm-form) When the form is reset, `reset` event will be emitted again
- (sm-date-picker) Fix issue with popover by adding back the `z-index: 5001;` override, similar to the Vue2 version

- (sm-radio-*) New prop introduced `isButtonStyleGroup` to allow sm-radio-group to attach the right class names when using the button style radio options instead of the default style.
  - *SUGGESTED FIX*: If you are using `sm-radio-group` with `sm-radio-button`, please set `isButtonStyleGroup` to true in the `sm-radio-group` component to ensure the correct class names are attached internally.

- (sm-carousel) ensure carousel is reactive to changes from data array prop [#1043](https://github.com/siteminder-au/sui/pull/1043)

- (sm-button) Remove double focus style on sm-button.

- (sm-media-*) Added original import path: `@siteminder/sui-core/components/sm-media`
  - In a future release, we will remove exposing this component from `@siteminder/sui-core/components/sm-media2`
    - *SUGGESTED FIX*: (if installing per component)
      ```ts
      // src/main.ts
      import SuiCore from '@siteminder/sui-core'
      import { SmMedia, SmMediaItem } from '@siteminder/sui-core/components/sm-media'

      // if installing per component
      Vue.component('sm-media', SmMedia)
      Vue.component('sm-media-item', SmMediaItem)
      ```

- (sm-nav-*) Added original import path: `@siteminder/sui-core/components/sm-nav`
  - In a future release, we will remove exposing this component from `@siteminder/sui-core/components/sm-nav2`
    - *SUGGESTED FIX*: (if installing per component)
      ```ts
      // src/main.ts
      import SuiCore from '@siteminder/sui-core'
      import { SmNav, SmNavItem } from '@siteminder/sui-core/components/sm-nav'

      // if installing per component
      Vue.component('sm-nav', SmNav)
      Vue.component('sm-nav-item', SmNavItem)
      ```

- (sm-tooltip) Added original import path: `@siteminder/sui-core/components/sm-tooltip`
  - In a future release, we will remove exposing this component from `@siteminder/sui-core/components/sm-tooltip2`
    - *SUGGESTED FIX*: (if installing per component)
      ```ts
      // src/main.ts
      import SuiCore from '@siteminder/sui-core'
      import { SmTooltip } from '@siteminder/sui-core/components/sm-tooltip'

      // if installing per component
      Vue.component('sm-tooltip', SmTooltip)
      ```
- (sm-tooltip) re-introduce `blockElement` prop to allow the target element of the tooltip to behave like a block element. The main use case is using tooltip inside a table cell. See [sm-table story](https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/?path=/story/components-table--editable-validation) for an example.

## sui-core@9.0.0-vue3
### First release :tada:
- (general) Ported the following components to vue3:
  - sm-form
  - sm-form-group
  - sm-checkbox
  - sm-date-picker
  - sm-input
  - sm-radio
  - sm-select
  - sm-switch
  - sm-loading-*
  - sm-404-page
  - sm-app-header
  - sm-aside
  - sm-badge
  - sm-banner
  - sm-button
  - sm-card
  - sm-carousel
  - sm-container
  - sm-dialog
  - sm-divider
  - sm-dropdown
  - sm-expandable-card
  - sm-help-card
  - sm-media
  - sm-nav
  - sm-page-title
  - sm-pagination
  - sm-table
  - sm-tag
  - sm-tooltip
  - sm-user-menu
  - sm-vertical-nav-*

- (general) `v-model` breaking changes, see https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model
  - All components have been updated to follow the new syntax. While the `v-model` shorthand will still work, using the longhand prop and event names will now need to conform to the new names: `modelValue` and `@update:modelValue` respectively.
    - *SUGGESTED FIX*: find all usages of `:value` and rename to `:modelValue`
    - *SUGGESTED FIX*: find all usages of `@input` and rename to `@update:modelValue`
  - The .sync modifier for v-bind has been removed as per the Vue 3 breaking change
    - *SUGGESTED FIX*: find all usages of `propName.sync` and rename to `v-model:propName`
- (general) Update peer dependency to `vue@^3.3.4`

- (sm-form) The following internal variables are no longer exposed via template refs:
  - `validate`
    - *SUGGESTED FIX*: update references to validate() which is now available from observerRef
      ```vue
      <!-- Before -->
      <script lang="ts">
        interface FormRef {
          validate: () => Promise<boolean>
        }
        const validateResults = await (formRef.value as FormRef).validate()
      </script>

      <template>
        ...
        <sm-form ref="formRef">
      </template>

      <!-- After -->
      <script lang="ts">
        interface FormRef {
          observerRef: {
            valid: boolean
            validate: () => Promise<{ valid: boolean }>
          }
        }
        const validateResults = await (formRef.value as FormRef).observerRef.validate()
      </script>

      <template>
        ...
        <sm-form ref="formRef">
      </template>
      ```
  - `reset`
  - `invalid`
  - `setInvalidState`

- (sm-form) Wrapper `validation-observer` component has been replaced with `Form` component
- (sm-form) New and updated functionality:
  - `handleSubmit`: Called when the native `submit` event is fired
    - Automatically prevents native submission at all times, used for AJAX submissions. This is the most common method you will use to handle form submissions manually, it accepts a callback that will be executed with the form values if the form is valid.
  - `resetForm`: Called when the native `reset` event is fired
    - Resets the form fields and validation state which is done by vee-validate
    - `reset` event is no longer emitted
  - Reference vee-validate sm-form document: https://vee-validate.logaretm.com/v4/guide/components/handling-forms/
- (sm-form) New and updated scoped slots:
  - `setFieldValue`, `setValues`: You can set any field value using either setFieldValue() or setValues(), both methods are exposed as scoped slot props.
  - `validate` is now exposed as a slot prop: This method will trigger the validation on all fields belonging to the form. You can validate the form without submissions using the validate() slot prop function: `<button type="button" @click="validate">Submit</button>`
  - `values`: You may access your form values using the `values` scoped slot prop
  - `errors`: You may access your form errors using the `errors` scoped slot prop
  - `isSubmitting`: When you might want to disable the submit button entirely until the submission attempt is done. You can use the `isSubmitting` slot prop to determine if the form is currently being submitted.
  Note that calling <code>validate</code> method from the Form slot props will not cause the <code>isSubmitting</code> state to change, it will only change if either submitForm or handleSubmit is called or when a submit event is triggered.
  - `invalid`: You can use the <code>invalid</code> slot prop to determine if the form is currently invalid. This is useful when you want to disable the submit button until the form is valid.
- (sm-form) New props:
  - `validationSchema`: The form-level validation schema is useful when you want to validate the form as a whole. Please follow the Storybook validation document for more details, https://vee-validate.logaretm.com/v4/guide/global-validators#schema-validation
  - `initialValues`: prop to set the initial values of the form

- (sm-form) The following form field components have been updated to use vee-validate v4:
  - sm-checkbox-group
  - sm-checkbox-button
  - sm-checkbox
  - sm-date-picker
  - sm-input
  - sm-radio
  - sm-radio-group
  - sm-radio-button
  - sm-select
  - sm-switch

  - These form field components share similar breaking changes:
    - See **`v-model` breaking change** section above
    - Deprecated prop `vid`: cross-field validation is now handled by vee-validate v4 using `name` prop as the id
    - Updated prop `rules`: ensure that rules string or object definition satisfies the vee-validate v4 requirements, see [here](https://vee-validate.logaretm.com/v4/guide/components/validation)
    - Updated prop `name`: this field is now *mandatory*. If you are using cross-field validation, please ensure that the `name` prop is unique across all fields. See [here](https://vee-validate.logaretm.com/v4/guide/components/validation#cross-field-validation).
      - *SUGGESTED FIX*: add `name` prop to all form field component usages (e.g. sm-input, sm-select, sm-switch, etc...)
    - Removed aria labels (e.g. aria-required, aria-invalid, aria-errormessage). These are not available for free from vee-validate any more. Consumers can still pass these in as props if they wish to use them. They will be attached as fallthrough attributes to the native input element.
    - Removed `validation-provider` wrapper component in individual form components
      - Accessing the template refs for this will no longer work

- (sm-form) Update the `vee-validate` and `@vee-validate/rules` packages to version 4
  - The new `vee-validate@4` version is a complete rewrite of the old version, which means it has breaking changes and internal API updates. However, we have tried to keep our public API as close as possible to the Vue 2 version.
- (sm-form) Vee-validate rules:
  - Added rules as a separate module into package.json: `@vee-validate/rules` recommended by vee-validate v4. See https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules for how to install and use the package.
    - *SUGGESTED FIX*: If your project has direct imports from `vee-validate/dist/rules` please update all references to `@vee-validate/rules` in your code.
  - Vee-validate has updated the validation rules, see the full list of rules [here](https://github.com/siteminder-au/sui/blob/vue3/libs/sui-core/src/app/libs/vee-validate/vee-validate.lang.json)
    - Renamed rules: `oneOf` to `one_of` and `excluded` to `not_one_of`
      - *SUGGESTED FIX*: Check and update the affected validation rule names
    - Vee-validate has a new `default` rule: "_default": "The field is not valid"
    - The implementation of validation rules can also vary between `vee-validate@3` and `vee-validate@4`. Please check the official repository for more details.

- (sm-input) The validation is not applied to `input` events anymore. This will also affect other components that use `sm-input`.
  - `sm-pagination` is affected by this change. The out-of-range page number will appear on the screen and will roll back to the last valid input on blur.
- (sm-input) The following API is no longer exposed via template refs:
  - `validationProviderRef`
- (sm-input) Deprecated validation `mode="eager"`, `mode="passive"`, `:mode="customModeFunction"` prop
  - The `mode="aggressive"` is still the default behaviour and `mode="lazy"` is implemented back into the component.
- (sm-input) Deprecated validation `debounce` prop
  - The built-in support in `vee-validate` has been deprecated and the library has
  issues (or limitations if the author intended it that way) wherein the validation
  is always executed in real time. See https://github.com/logaretm/vee-validate/issues/4161.
  - As a workaround, a custom rule can be used with debounce and async validator implementation within it to limit expensive calculations, for instance when calling an API endpoint.
  ```ts
  /**
   * Copied from https://gist.github.com/lalosh/0bf01d3e321af32e6acb70220b4e1a12
   * to demonstrate cancellable debounced validation
   */
  let debounceRef
  const debounceCustomRule = (value: string | undefined): Promise<string | boolean> => {
    return new Promise((resolve) => {
      // cancel any old refs
      if (debounceRef && typeof debounceRef.cancel === 'function') {
        debounceRef.cancel()
      }

      // Create a new instance and save it for later
      debounceRef = debounce(() => {
        return yourCustomRuleLogic(value)
          ? resolve(true)
          : resolve('Your custom error message') // Consumers need to handle translations here
      }, 1000)

      // Execute will start after 1000 unless cancelled because the function is re-invoked again
      debounceRef()
    })
  }

  /**
   * Define your custom async rule
   * Example: https://vee-validate.logaretm.com/v4/examples/async-validation/
   */
  defineRule('debouncedCustomRule', async (value: string | undefined) => {
    const result = await debounceCustomRule(value)

    return result
  })
  ```

  ```vue
  <!-- Then use the custom rule in your template -->
  <sm-input v-model="field" name="field" label="Debounced field" rules="debouncedCustomRule" />
  ```

- (sm-input) Inferred validation rules from the input `type` and other props have been removed. You need to pass in the relevant rules now.
  - E.g. using `<sm-input type="email" />` automatically validates for invalid email before, however, now you need to specify the rule.
  For instance `<sm-input type="email" rules="email">`. See the old docs on which rules were inferred before in https://vee-validate.logaretm.com/v3/guide/rules.html#rules and the global rules you can use in the new version in https://vee-validate.logaretm.com/v4/guide/global-validators#available-rules.

- (sm-input) Please note: We do not recommend using the inline style for the `sm-input` component. If you are using inline styles it can result in UI issues. However, for Vue3 migration purposes we still support this, which needs to be removed or readjusted based on the current UI on downstream projects.

- (sm-date-picker) Update the `v-calendar` package to version 3
  - Many of the breaking changes below are a result of the `v-calendar` package upgrade. See their [upgrade guide](https://vcalendar.io/getting-started/upgrade-guide.html) for more details.
- (sm-date-picker) Updated `v-calendar` and internal HTML structure and CSS class names
  - The new version comes with changes in the HTML structure and CSS class names. This will likely break any direct references to the plugin's selectors, classes or built-in accessibility hooks.
    - For instance, when selecting dates from the picker, the labels were using full month names before, now it has been updated to short names, e.g `September 20, 2022` to `Sep 20, 2022`
- (sm-date-picker) The `sm-input` usage inside the component has been removed and replaced with its implementation for the input field(s).
- (sm-date-picker) `model-config` prop has been deprecated and replaced with the following props:
  - `model-modifiers` - See https://vcalendar.io/datepicker/basics.html#model-modifiers for more details.
  - `mask` - Use `input` to format the string displayed in the input field.
    - Note: formatting the `modelValue` will not be supported.
    - See https://vcalendar.io/i18n/masks.html#masks for more details.
  - `time-rules` - Specifically for `timeAdjust`. See https://vcalendar.io/datepicker/time-rules.html for more details.
- (sm-date-picker) `minute-increment` prop has been deprecated and replaced with `time-rules` prop.
  - See https://vcalendar.io/datepicker/time-rules.html for more details
    ```vue
    <!-- Before -->
    <sm-date-picker :minute-increment="10" />

    <!-- After -->
    <sm-date-picker :time-rules="{ minutes: { interval: 10 } }" />
    ```
- (sm-date-picker) `available-dates` prop has been deprecated
  - Please switch over to `disabled-dates` prop instead. See https://vcalendar.io/datepicker/basics.html#disable-dates for more details.
- (sm-date-picker) `disabled-dates` API has been updated
  - `disabled-dates` must now be an array.
  - Repeated dates are now wrapped `repeat` object.
  - See https://vcalendar.io/datepicker/basics.html#disable-dates for more details.
    ```vue
    <!-- Before -->
    <sm-date-picker :disabled-dates="{ weekdays: [1, 7] }" />

    <!-- After -->
    <sm-date-picker :disabled-dates="[{ repeat: { weekdays: [1, 7] } }]" />
    ```
- (sm-date-picker) Using `mode="date"` will now zero out hours, minutes, seconds and milliseconds in the resulting value
  - See https://vcalendar.io/datepicker/time-rules.html#auto-rules.
- (sm-date-picker) `readonly` is now implemented
  - Previously, setting the `readonly` prop does nothing. This will now apply the correct state thereby making the input field not typeable.
- (sm-date-picker) AM/PM selection in the time picker has changed from button group to select
  - Tests around this interaction will need to be updated
- (sm-date-picker) Validation rules are now run against the component's v-model/modelValue
  - Previously, the validation rules were applied to the internal sm-input. This change is to make the `v-calendar` plugin work with `vee-validate`, and ensure that the submitted values via `sm-form` are using the v-model values rather than displayed text in the input fields.
- (sm-date-picker) The following internal variables are no longer exposed via template refs:
  - `cssVars`
  - `calculateInputDimensions`
- (sm-date-picker) When using `model-modifiers="{ string: true }`:
  - sm-date-picker will always use UTC internally as the timezone and ignore the timezone prop passed in.
    - *SUGGESTED FIX*: Pass in a valid date string without an offset or in UTC ISO8601 format (e.g. 2020-05-24 or 2020-05-24T00:00:00.000Z).
  - sm-date-picker will always return the date in ISO-8601 format (e.g. 2020-05-24T00:00:00.000Z).
    - *SUGGESTED FIX*: When sm-date-picker emits the changed modelValue from v-model or @update:modelValue, format the string your desired format.
- (sm-date-picker) Time picker with no initial value, on focus will show the current time.
  - This is a current workaround until this [v-calendar issue](https://github.com/nathanreyes/v-calendar/issues/1316) is resolved.
- (sm-date-picker) NOTE: if your application is using the migration build (`@vue/compat`), you will need to set `configureCompat({ COMPONENT_V_MODEL: false })` globally to use `mode="dateTime"` or `mode="time"` of the component. See https://v3-migration.vuejs.org/migration-build.html#global-config for more details.

- (sm-radio-*) When `sm-radio` or `sm-radio-button` is used within `sm-radio-group`, you must manually set `:error-disabled="true"` on the `sm-radio` component to avoid error messages appearing beside each radio button in case of validation rule.
- (sm-radio-*) HTML structure and CSS have been refactored, so any direct references to those will likely break. (e.g sm-radio-group--disabled has been removed)
- (sm-radio-*) Deprecated `buttonAnimation` prop in `sm-radio-group` since sliding animation on radio buttons has been removed
- (sm-radio-*) The following internal variables are no longer exposed via template refs:
  - `indicatorStyles`
  - `showIndicator`
  - `hasRadioButton`
  - `isDisabled`


- (sm-select) Update the `vue-multiselect` package to version 3
- (sm-select) The following API is no longer exposed via template refs:
  - `validationProviderRef`
- (sm-select) Added new props `onListScrollEnd`
  - Vue 3 has breaking changes around the $listeners, and event listeners are now just attributes and prefixed with "on". See here: https://v3-migration.vuejs.org/breaking-changes/listeners-removed.html
  - To access the current event listener "list-scroll-end' emit event use "onList-scroll-end" props.
- (sm-select) Error validation won't trigger the required validation error when selecting a `null` value option when starting from an empty state, e.g. `{ label: 'Please choose', code: null }`

- (sm-switch) The following internal variables are no longer exposed via template refs:
  - `inputId`
  - `inputAttrBindings`
  - `focussed`
  - `inputEventBindings`
  - `onControlClick`

- (sm-field-error) The `ariaMsg` prop is now optional
- (sm-field-label) `state.focussed` has been moved to a new prop named `focussed`
- (sm-field-label) Updated prop `state` which now follows the `FieldMeta` interface from [meta](https://vee-validate.logaretm.com/v4/api/use-field/) object from vee-validate:
  ```ts
  interface FieldMeta {
    touched: boolean; // if the field has been blurred (via handleBlur)
    dirty: boolean; // if the field has been manipulated (via handleChange)
    valid: boolean; // if the field doesn't have any errors
    pending: boolean; // if validation is in progress
    initialValue?: any; // the field's initial value
    validated: boolean // additional prop: if the field has been validated
  }
  ```

- (sm-media-*) Added new `sm-media` and `sm-media-item` components
  - Downstream projects should move from `sm-media` to `sm-media2` and `sm-media-item` to `sm-media-item2` before the Vue 3 upgrade
  - The new sm-media has also dropped several features and props to minimise code complexity:
    - `sm-media`
      - Deprecated props: `gridItemHeight`, `isSelectable`, `multipleSelections`.
      - Removed private variables/functions: `mediaItems`, `resetSelections`.
    - `sm-media-item`
      - Introduced props: `isSelectable`, `gridItemWidth`, `gridItemHeight`.
      - Removed private variables/functions: `itemWidth`, `itemHeight`, `resetSelection`.
  - Downstream projects should audit usages of `sm-media/sm-media-item` and remove any references to the above props, variables and functions
    ```ts
    // src/main.ts
    import SuiCore from '@siteminder/sui-core'
    import { SmMedia, SmMediaItem } from '@siteminder/sui-core/components/sm-media2'
    // if installing all 120+ components
    Vue.use(SuiCore, { i18n })

    // register the new media component under a different name (e.g. sm-media2) if you did a full install of sui-core and want to incrementally switch over to the new component version in your webapp
    // this is to avoid conflicts with the old sm-media registration which will be using `sm-media` name
    Vue.component('sm-media2', SmMedia)
    Vue.component('sm-media-item2', SmMediaItem)
    ```
- (sm-media-*) It is now mandatory to use the `media` slot to display elements
  - *SUGGESTED FIX*:
    ```vue
    <!-- Before -->
    <sm-media
      @filesAdded="uploadedFiles"
      :accept-mime="acceptMime"
      :images.sync="images"
    >
      <sm-media-item v-for="(image, i) in images" :key="image.src" :src="image.src">
        <sm-button shape="square" aria-label="Edit media item">
          <sm-icon name="action-edit" aria-hidden="true" />
        </sm-button>
      </sm-media-item>
    </sm-media>

    <!-- After -->
    <sm-media
      @filesAdded="uploadedFiles"
      :accept-mime="acceptMime"
      v-model:images="images"
    >
      <template #media="{image}">
        <sm-media-item
          :key="image.src"
          :src="image.src"
        >
          <sm-button shape="square" aria-label="Edit media item">
            <sm-icon name="action-edit" aria-hidden="true" />
          </sm-button>
        </sm-media-item>
      </template>
    </sm-media>
    ```
- (sm-media-*) v-for directive is not needed any more on sm-media-item (it is handled internally by sm-media)

- (sm-nav-*) Added a new `sm-nav` and `sm-nav-item` components
  - The new sm-nav/sm-nav-item components will be registered by default when doing a full install.
  - Downstream projects should audit usages of `sm-nav/sm-nav-item` and its props, variables and functions. For example, checking for added and deprecated props. Check Storybook for updated examples.
  - Transition animations have been removed when navigating between sub-menu nav items

- (sm-tooltip) Added a new `sm-tooltip` component that consumes `floating-vue` package (sponsored by EvanYou)
  - Downstream projects should move from sm-tooltip to `sm-tooltip2` before the Vue 3 upgrade
  - The new tooltip has also dropped several features and props to minimise code complexity:
    - drop focus support trigger
    - drop theming (from sui-themes)
    - drop props: `visible`, `stopPropagation`, `textAlign`, `blockElement`
  - Please ensure that when you migrate your webapp to the new sm-tooltip, you remove any usages of the above props.
  - There are changes to the HTML structure, class names and styles.
  - Passing an empty title prop will still render the tooltip. This is a breaking change from the old sm-tooltip. To avoid rendering the tooltip, use disabled prop or use a v-if directive.
    ```ts
    // src/main.ts
    import SuiCore from '@siteminder/sui-core'
    import { SmTooltip } from '@siteminder/sui-core/components/sm-tooltip2'

    // if installing all 120+ components
    Vue.use(SuiCore, { i18n })

    // register the new sm-tooltip under a different name (e.g. sm-tooltip2) if you did a full install of sui-core and want to incrementally switch over to the new component version in your webapp
    // this is to avoid conflicts with the old sm-tooltip registration which will be using `sm-tooltip` name
    Vue.component('sm-tooltip2', SmTooltip)
    ```

- (sm-table-*) `sm-table-tr`: Consumers need to use the `highlight` prop to manually apply highlight styling on a non-header table row
- (sm-table-*) `sm-table-tr`: `sm-table-tr--expanded` class name has been renamed to `sm-table-tr--highlight`

- (sm-tabs-*) The following variables are no longer exposed via template refs:
  - `activeTabIndex`
  - `tabs`
  - `getValue`
- (sm-tabs-*) The following functions have been removed:
  - `getTabsItems`
  - `getValue`
  - `toggle`
- (sm-tabs-*) The following variables have been renamed:
  - `isLargeScreen` -> `isMobileScreen`
  - `visibleSmallScreen` -> `toggleTabDropdown`
