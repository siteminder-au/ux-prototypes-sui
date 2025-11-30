# Changelog
All notable changes to the vue3 build will be documented in this file.

Ensure you are on the latest vue2 build of sui-icons before upgrading to the vue3 build.

<!--
please use the following format for the changelog.
changes should be categorised relative to the previous version.
Some examples:
- if it's a new component that didn't exist in the previous version, it will be a minor change.
- if it's renaming/deleting a prop or changing the behaviour of a component relative to the previous version, it will be a breaking change.

## sui-themes@<version>-vue3
### Breaking changes
- (component) short description [#123](github link)

### Minors & Patches
- (component) short description [#123](github link)

### Internal
- (component) short description [#123](github link)
-->

---

## sui-themes@23.4.0-vue3
### Minors & Patches
- (sm-content-slider) Update the image background to transparent [#1430](https://github.com/siteminder-au/sui/pull/1430/)
- (sm-media) Add `is-invalid` prop support that applies `--color-warning` token to border-color [#1430](https://github.com/siteminder-au/sui/pull/1430/)

## sui-themes@23.0.0-vue3
### Breaking changes
- (sm-button) Removed theming support. The tokens are now co-located in `sui-core` [#1405](https://github.com/siteminder-au/sui/pull/1405)

### Minors & Patches
- (sm-checkbox, sm-checkbox-button) Add keyboard interaction [1410](https://github.com/siteminder-au/sui/pull/1410)
  - Introduced new variables:
    - --sm-c-checkbox-control-color-outline-focus
    - --sm-c-checkbox-control-outline-width-focus
    - --sm-c-checkbox-button-label-box-shadow-focus
    - --sm-c-checkbox-button-label-color-text-focus
    - --sm-c-checkbox-button-label-color-background-focus
    - --sm-c-checkbox-button-label-color-text-checked-focus
    - --sm-c-checkbox-button-label-color-background-checked-focus

## sui-themes@22.7.0-vue3
- (sm-table) Update disabled state styles for `sm-table-td` [#1400](https://github.com/siteminder-au/sui/pull/1400)

## sui-themes@22.1.0-vue3
- (sm-switch-group) Update the border-bottom color to use the official SUI color [#1363](https://github.com/siteminder-au/sui/pull/1363)
  - Also removes the border-bottom on the last item to follow the unthemed style

## sui-themes@22.0.0-vue3
### Breaking changes
- (sm-banner) Removed `--sm-c-banner-close-right` and `--sm-c-banner-close-top` tokens. The close button's placement is now fixed. [#1353](https://github.com/siteminder-au/sui/pull/1353)

## sui-themes@20.0.0-vue3
### Internal
- (General) Update devDependencies around testing and linting [#1309](https://github.com/siteminder-au/sui/issues/1309)

## sui-themes@19.0.0-vue3
### Breaking changes
- Removed theming support for the following. The tokens are now co-located in `sui-core`
  - sm-dialog [#1286](https://github.com/siteminder-au/sui/pull/1286)
  - sm-help-card [#1286](https://github.com/siteminder-au/sui/pull/1286)
  - sm-loading-bar and all other sm-loading-* components using it [#1286](https://github.com/siteminder-au/sui/pull/1286)
  - sm-badge [#1301](https://github.com/siteminder-au/sui/pull/1301)
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
- (sm-user-menu) Fix the default, hover and focused state of the icon and label [#1295](https://github.com/siteminder-au/sui/pull/1295)

## sui-core@18.0.0-vue3
### Breaking changes
- (sm-app-header) Adjusted styles based on the sui-core refactor to use flexboxes in positioning the top-right menu items [#1289](https://github.com/siteminder-au/sui/pull/1289)
- (sm-input, sm-select, sm-color-picker) Introduced new variables for box-shadow [#1290](https://github.com/siteminder-au/sui/pull/1290)
  - Introduced new variables:
    - --sm-c-input-box-shadow-focus
    - --sm-c-input-box-shadow-focus-invalid
    - --sm-c-select-box-shadow-focus
    - --sm-c-select-box-shadow-focus-invalid
    - --sm-c-color-picker-input-field-box-shadow-focus
  - Deprecated the following variables:
    - --sm-c-input-border-width-bottom-focus
    - --sm-c-select-border-width-bottom-focus
    - --sm-c-color-picker-input-field-color-border-width-bottom-focus

## sui-themes@16.1.0-vue3
### Minors & Patches
- (sm-table) Introduced new variable --sm-c-table-tr-color-background-selected for selected state [#1257](https://github.com/siteminder-au/sui/pull/1257)

## sui-themes@15.0.0-vue3
### Breaking changes
- (sm-user-list-item) Deprecated --sm-c-user-list-date-right in favor of making the component responsive [#1220](https://github.com/siteminder-au/sui/pull/1220)
- (sm-horizontal-nav-item) Added theming support for —sm-horizontal-nav-item--exact-active [#1234](https://github.com/siteminder-au/sui/pull/1234)
  - Introduced new variable --sm-c-app-header-horizontal-nav-item-indicator-color-exact-active
  - Modified --sm-c-app-header-horizontal-nav-item-indicator-color-active
  - Moved styles from `.sm-horizontal-nav-item--active .sm-horizontal-nav-item__content` to `.sm-horizontal-nav-item--exact-active .sm-horizontal-nav-item__content` for properties color, font-weight, and background

## sui-themes@13.0.0-vue3
### Breaking changes
- Removed theming support for the following deprecated components [#1153](https://github.com/siteminder-au/sui/pull/1153):
  - sm-connector - Component was deprecated in `sui-core@3.0.0` (Vue2)
  - sm-side-panel - Component was deprecated in `sui-core@3.0.0` (Vue2)
  - sm-skip-link - Component was deprecated in `sui-core@3.0.0` (Vue2)
  - sm-multi-select - Never ported since `sui-core@9.0.0-vue3`
  - sm-tag-filters - Never ported since `sui-core@9.0.0-vue3`

### Minors & Patches
- Removed references to the above components from [#1153](https://github.com/siteminder-au/sui/pull/1153):
  - sm-field-error
  - sm-field-label
  - sm-input

### Internal
- (sm-date-picker) Removed theming file overrides which has been deprecated in `sui-themes@9.0.0-vue3` [#1153](https://github.com/siteminder-au/sui/pull/1153)

## sui-themes@9.0.0-vue3
### Breaking changes
- (sm-date-picker) Remove theming support
  - Upgraded the third-party plugin to `v-calendar@3` for Vue3 support which had changes to the HTML structure and CSS class names making it incompatible with the theming library at this time.
