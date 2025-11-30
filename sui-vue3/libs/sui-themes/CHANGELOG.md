# Changelog
All notable changes to the vue2 build will be documented in this file.

To see vue3 build CHANGELOG, see CHANGELOG.vue3.md instead.

## [Unreleased]:exclamation:
##### Breaking changes
- NA
##### Minors & Patches
- NA

## sui-themes@7.0.0
##### Breaking changes
- SUI-1597, sm-carousel theming [#764](https://github.com/siteminder-au/sui/pull/764)
  - Deprecated
    - `--sm-c-carousel-navigation-width`
    - `--sm-c-carousel-navigation-box-shadow-focus`
    - `--sm-c-carousel-navigation-arrow-border-radius`
    - `--sm-c-carousel-navigation-arrow-border-width`
    - `--sm-c-carousel-navigation-arrow-color-border`
    - `--sm-c-carousel-navigation-arrow-height`
    - `--sm-c-carousel-navigation-arrow-width`
    - `--sm-c-carousel-navigation-prev-arrow-left`
    - `--sm-c-carousel-navigation-next-arrow-right`
    - `--sm-c-carousel-count-border-radius`
    - `--sm-c-carousel-count-bottom`
    - `--sm-c-carousel-count-left`
    - `--sm-c-carousel-count-min-width`
    - `--sm-c-carousel-count-font-weight`
  - New
    - `--sm-c-carousel-circle-color-background`
    - `--sm-c-carousel-circle-color-outline-focus`
    - `--sm-c-carousel-navigation-arrow-color`
##### Minors & Patches
- NA

## sui-themes@6.0.0
##### Breaking changes
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
- SUI-1252 Add Stylelint and fix minor issues [#719](https://github.com/siteminder-au/sui/pull/719)

## sui-themes@5.0.0
##### Breaking changes
- SUI-1529 Requires sui-core@5.0.0 installed [#715](https://github.com/siteminder-au/sui/pull/715)
- SUI-1529 Changed the classname that controls the cross browser compatible nested dot for child sm-vertical-nav-item. Downstream projects that have theming on this nested dot should audit their webapps for any visual regressions. [#715](https://github.com/siteminder-au/sui/pull/715)

## sui-themes@2.0.0
##### Breaking changes
- Moved to vite build tool (see sui-core changelog)
##### Minors & Patches
- NA

## sui-themes@1.1.0
##### Breaking changes
- NA
##### Minors & Patches
- SUI-1366: upgrade typescript to v5

## sui-themes@1.0.0
##### Minors & Patches
- SUI-1219: Add sm-help-card component [#653](https://github.com/siteminder-au/sui/pull/653)
##### Backward compatibility
- SUI-1255: (all) node v18 upgrade

## sui-themes@0.20.0 (06/Mar/2023)
##### Minors & Patches
- SUI-1174 Add tokens for sm-drawer mobile-actions slot and general style updates [#586](https://github.com/siteminder-au/sui/pull/586)

## sui-themes@0.19.0 (23/Jan/2023)
##### Minors & Patches
Add theming support [#547](https://github.com/siteminder-au/sui/pull/547) [#551](https://github.com/siteminder-au/sui/pull/551)
- SUI-1095 theme sm-vertical-nav inside sm-dropdown
- SUI-1100 theme sm-media
- SUI-1101 theme sm-progress-bar
- SUI-1104 theme sm-slider
- SUI-1105 theme sm-switch
- SUI-1108 theme sm-user-list

Add new token in sm-select [#545](https://github.com/siteminder-au/sui/pull/545)
- `--sm-c-select-color-border-invalid`

## sui-themes@0.18.0 (09/Jan/2023)
##### Minors & Patches
Add theming support [#537](https://github.com/siteminder-au/sui/pull/537) [#540](https://github.com/siteminder-au/sui/pull/540)
- SUI-1088 theme sm-carousel
- SUI-1089 theme sm-color-picker
- SUI-1090 theme sm-connector
- SUI-1092 theme sm-content-slider
- SUI-1096 theme sm-html-truncator
- SUI-1097 theme sm-inline-card
- SUI-1106 theme sm-text-truncator

## sui-themes@0.17.0 (06/Dec/2022)
#### Minors & Patches
Add theming support [#526](https://github.com/siteminder-au/sui/pull/526)
- SUI-1025 theme sm-multi-select
- SUI-1028 theme sm-calendar
- SUI-1030 theme sm-expandable-card
- SUI-1091 theme sm-container
- SUI-1093 theme sm-divider
- SUI-1094 theme sm-form-group
- SUI-1098 theme sm-lazy-image
- SUI-1099 theme sm-loading-image
- SUI-1102 theme sm-section
- SUI-1103 theme sm-skip-link
- SUI-1107 theme sm-translations-input

Add tokens to specific components [#526](https://github.com/siteminder-au/sui/pull/526)
- `--sm-c-select-dropdown-box-shadow`
- `--sm-c-table-td-arrow-color-icon`
- `--sm-c-wizard-tablist-progress-ring-color-background`, `--sm-c-wizard-tablist-progress-ring-color-foreground`

## sui-themes@0.16.0 (23/Nov/2022)
##### Minors & Patches
- SUI-757 theme new component sm-side-panel [#522](https://github.com/siteminder-au/sui/pull/522)

## sui-themes@0.15.0 (26/Oct/2022)
##### Minors & Patches
- SUI-1024 theme sm-popover [#502](https://github.com/siteminder-au/sui/pull/502)
- SUI-1026 theme sm-list [#502](https://github.com/siteminder-au/sui/pull/502)
- SUI-1029 theme sm-controller [#502](https://github.com/siteminder-au/sui/pull/502)

## sui-themes@0.14.0 (12/Oct/2022)
##### Minors & Patches
- SUI-1022 theme sm-tooltip [#497](https://github.com/siteminder-au/sui/pull/497)
- SUI-1027 theme sm-page-title [#497](https://github.com/siteminder-au/sui/pull/497)

## sui-themes@0.13.0 (28/Sep/2022)
##### Minors & Patches
- SUI-953 theme sm-tag along with usage in sm-select and sm-tag-filters [#492](https://github.com/siteminder-au/sui/pull/492)

## sui-themes@0.12.0 (14/Sep/2022)
##### Minors & Patches
- SUI-951 theme sm-wizard [#484](https://github.com/siteminder-au/sui/pull/484)
- SUI-1006 sm-button new variables for button type spinner colors [#484](https://github.com/siteminder-au/sui/pull/484)

## sui-themes@0.11.0 (31/Aug/2022)
##### Minors & Patches
- SUI-949 theme sm-checkbox and sm-select's checkbox (multiple variant) [#481](https://github.com/siteminder-au/sui/pull/481)
- SUI-950 theme sm-tabs [#481](https://github.com/siteminder-au/sui/pull/481)
- SUI-954 theme sm-toast [#481](https://github.com/siteminder-au/sui/pull/481)
- SUI-955 theme sm-drawer [#481](https://github.com/siteminder-au/sui/pull/481)

## sui-themes@0.10.0 (3/Aug/2022)
##### Minors & Patches
- SUI-946 theme sm-accordion [#464](https://github.com/siteminder-au/sui/pull/464)

## sui-themes@0.9.0 (20/July/2022)
##### Minors & Patches
- SUI-937 mobile heading style updates [#459](https://github.com/siteminder-au/sui/pull/459)
- SUI-930 sm-aside new variables for footer slot [#462](https://github.com/siteminder-au/sui/pull/462)
- SUI-947 theme sm-badge [#462](https://github.com/siteminder-au/sui/pull/462)
- SUI-948 theme sm-banner [#462](https://github.com/siteminder-au/sui/pull/462)

## sui-themes@0.8.0 (23/June/2022)
##### Minors & Patches
- SUI-792 add typography theming tokens [#452](https://github.com/siteminder-au/sui/pull/452)
- SUI-889 sm-table add responsive stacked rows prop [#452](https://github.com/siteminder-au/sui/pull/452)
- SUI-922 sm-card bright theme color alignment with new branding [#450](https://github.com/siteminder-au/sui/pull/450)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA


## sui-themes@0.7.0 (08/June/2022)
##### Minors & Patches
- SUI-786 Theme sm-date-picker [#446](https://github.com/siteminder-au/sui/pull/446)
- SUI-787 Theme sm-radio and sm-radio-button [#446](https://github.com/siteminder-au/sui/pull/446)
- SUI-789 Theme sm-table [#446](https://github.com/siteminder-au/sui/pull/446)
- SUI-815 Theme sm-card [#446](https://github.com/siteminder-au/sui/pull/446)
- SUI-890 Theme sm-app-header tablet navigation [#448](https://github.com/siteminder-au/sui/pull/448)
- SUI-907 Add disabled loading spinner token [#449](https://github.com/siteminder-au/sui/pull/449)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA


## sui-themes@0.6.0 (12/May/2022)
##### Minors & Patches
- SUI-884 Add sm-app-header theming [#438](https://github.com/siteminder-au/sui/pull/438)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-themes@0.5.0 (28/Apr/2022)
##### Minors & Patches
- SUI-788 sm-pagination theming [#433](https://github.com/siteminder-au/sui/pull/433)
- SUI-790 skeleton loaders theming [#433](https://github.com/siteminder-au/sui/pull/433)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-themes@0.4.0 (14/Apr/2022)
##### Minors & Patches
- SUI-656 form components style updates [#424](https://github.com/siteminder-au/sui/pull/424)
- SUI-876 sm-breadcrumbs theming [#425](https://github.com/siteminder-au/sui/pull/425)
- SUI-877 sm-aside and sm-vertical-nav theming [#426](https://github.com/siteminder-au/sui/pull/426)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-themes@0.3.1 (17/Mar/2022)
##### Minors & Patches
- SUI-833 Updated theming spacing variables [#401](https://github.com/siteminder-au/sui/pull/401)

##### Backward compatibility
- SUI-833 Updated theming spacing variables [#401](https://github.com/siteminder-au/sui/pull/401)

##### Contribution to the release :clap:
- NA

## sui-themes@0.3.0 (03/Mar/2022)
##### Minors & Patches
- SUI-785 Theme sm-dropdown [#396](https://github.com/siteminder-au/sui/pull/396)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-themes@0.2.0 (16/Feb/2022)
##### Minors & Patches
- SUI-784 Theme sm-dialog [#392](https://github.com/siteminder-au/sui/pull/392)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-themes@0.1.0 (19/01/2022)
##### Minors & Patches
- SUI-751 Input theming [#374](https://github.com/siteminder-au/sui/pull/374) [#379](https://github.com/siteminder-au/sui/pull/379)
- SUI-775 Select theming [#374](https://github.com/siteminder-au/sui/pull/374) [#379](https://github.com/siteminder-au/sui/pull/379)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA

## sui-themes@0.0.2 (7/01/2022)
##### Minors & Patches
- SUI-738 - Update SUI colors [#362](https://github.com/siteminder-au/sui/pull/362)
- SUI-771 - Add the theme variables for the components that have a button as a child component [#371](https://github.com/siteminder-au/sui/pull/371)

##### Backward compatibility
- SUI-771 - sm-button removed --sm-c-button-padding-large theming variable [#371](https://github.com/siteminder-au/sui/pull/371)

##### Contribution to the release :clap:
- NA

## sui-themes@0.0.1 (24/11/2021)
##### Minors & Patches
- SUI-665 - Theming Tech research and documentation and Intial setup [#349](https://github.com/siteminder-au/sui/pull/349)

##### Backward compatibility
- NA

##### Contribution to the release :clap:
- NA
