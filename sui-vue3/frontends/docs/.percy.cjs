module.exports = {
  version: 2,
  discovery: {
    // Lowering concurrency to prevent CPU contention and flakiness. It will slow
    // down the snapshot process but it's a trade-off for stability. Increase or
    // decrease it locally to find the sweet spot for your machine until we
    // are able to run it through CI.
    concurrency: 4, // Default 10
    // Bump asset discovery to prevent:
    // - flaky font loading since they are loaded from Google Fonts. See https://docs.percy.io/docs/debugging-sdks#assets-never-requested-by-asset-discovery
    // discovery.networkIdleTimeout: must be <= 750
    networkIdleTimeout: 750, // ms
  },
  snapshot: {
    widths: [
      /**
       * Just cover the desktop viewport because we have a monthly screenshot limit
       * See https://docs.percy.io/docs/responsive-visual-testing#usage
       *
       * We'll need to cover these once we have more bandwidth to do so.
       *
       * However, for stories that are critical to cover multiple viewports, they are
       * configured in the story files.
       */
      // Use this instead of 320: https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide
      // 360,
      // 769,
      1025,
      // We have some components with extra-large-desktop views. We can selectively add them via story files for now rather than enabling for all
      // https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide
      // 1367px,
    ],
    // Don't enable JS globally, it's causing Percy to slow down and cause flaky
    // assets. If you need it, i.e extra setup or the component itself relies on
    // JS to render, add it in the story level instead.
    // Read https://www.browserstack.com/docs/percy/integrate/storybook#performance
    // and https://www.browserstack.com/docs/percy/integrate/storybook#unexpected-diffs
    // before attempting to enable it globally again. Slower machines are more
    // prone to flakiness.
    // enableJavascript: true
  },
  storybook: {
    queryParams: {
      // Attached to the iframe URL when taking Percy screenshots. This allows us to
      // customize the story when needed, e.g perform actions like opening a dropdown
      isPercy: true,
    },
    include: [
      /**
       * Get snapshots from stories under "Components" root
       *
       * When needed, you can filter things here to run a subset of stories locally
       * Format is "<Root>/<Component>: <Story name>"
       * E.g "Components/Card: Upsell Card" to run a single story
       *
       * Tip: Run `npm run percy:<env> -- --dry-run` first to verify the list
       */
      'Components/',
    ],
    exclude: [
      /**
       * Standard story names that we can globally exclude
       */
      'Styling hooks',
      /**
       * Skip component specific stories
       * While per-story `widths` config works with Component Story File (CSF) format, `skip` doesn't so we need to match the titles here and exclude them.
       *
       * Once we migrate to Storybook 6+, we can move the skip config to their own stories
       * See https://docs.percy.io/docs/storybook#configuration
       */
      'Accordion: Collapse content', // Behaviour-centric
      'App Header: Page title and subtitle', // Already covered in Tablet Navigation: Vertical nav items
      'App Header: Property menu with subnav', // Needs consecutive actions, better suited for E2E with Percy
      'Card: Upsell Card - Responsive', // Already covered in upsell cards
      'Dialog: As a service - Loading & Disabled', // API specifics can be covered by unit or E2E testing
      'Dialog: As a service', // API specifics can be covered by unit or E2E testing
      'Drawer: Close & Open Hooks', // API specifics can be covered by unit testing
      'Form: Cross Field Validation', // API specifics can be covered by unit or E2E testing
      'Form/Calendar: Month and year: Disabled', // Already covered in Masks
      'Form/Calendar: Month and year$', // Already covered in Masks
      'Form/Calendar: Month and year: Locale', // API specifics can be covered by unit testing
      'Form/Checkbox: Validation', // Already in Form: Validation
      'Form/Date Picker: Locale:i18n', // API specifics can be covered by unit testing
      'Form/Date Picker: Masks', // API specifics can be covered by unit testing
      'Form/Date Picker: Single date', // Already covered in Disabling dates
      'Form/Date Picker: Timezone', // API specifics can be covered by unit testing
      'Form/Input: Editable cell', // Already covered in tables
      'Form/Input: Validation mode and debounce', // API specifics can be covered by unit testing
      'Form/Multi-select: Advanced filters', // Already covered in other stories
      'Form/Multi-select: Disallow empty', // API specifics can be covered by unit testing
      'Form/Multi-select: Multi-select: hide select all or group', // API specifics can be covered by unit testing
      'Form/Multi-select: Multi-select: Option groups', // Already covered in label and description
      'Form/Multi-select: Multi-select$', // Already covered in label and description
      'Form/Multi-select: Validation', // Already covered in Form: Validation
      'Form/Radio: Validation', // Already in Form: Validation
      'Form/Select: Label and description$', // Already covered by Disabled
      'Form/Select: Multiple and create new', // API specifics can be covered by unit testing
      'Form/Select: Not allow empty option', // Behaviour-centric
      'Form/Select: Option groups', // Already covered by Label and description truncation
      'Lazy Image', // Already covered in loading image and media
      'List: Connected list', // Behaviour-centric
      'List: Draggable list', // Behaviour-centric
      'List: Nested Draggable items', // Behaviour-centric
      'List: Nested Non-Draggable child items', // Behaviour-centric
      'List: Sample: Conditional Draggable item', // Behaviour-centric
      'List: Static Header', // Already covered in Stacked
      'Loading/Loading Dashboard: Graph card', // Already covered in Standard
      'Loading/Loading Dashboard: Long card', // Already covered in Standard
      'Loading/Loading Dashboard: Small card', // Already covered in Standard
      'Lottie player', // Already covered in 404 page
      'Media: Default - Populated', // Already covered in Drag & Drop
      'Media: Drag & Drop - Conditionally', // Behaviour-centric
      'Media: Empty with Populated', // API specifics can be covered by unit or E2E testing
      'Media: Single file upload', // API specifics can be covered by unit or E2E testing
      'Media2: Default - Populated', // Already covered in Drag & Drop
      'Media2: Drag & Drop - Conditionally', // Behaviour-centric
      'Media2: Drag & Drop - Empty Container', // Behaviour-centric
      'Media2: Empty with Populated', // API specifics can be covered by unit or E2E testing
      'Media2: Single file upload', // API specifics can be covered by unit or E2E testing
      'Pagination: Callbacks', // API specifics can be covered by unit testing
      'Popover: Custom Content', // API specifics can be covered by unit testing
      'Progress bar: Internal percentage', // Already covered in Status
      'Section: Element Tag', // API specifics can be covered by unit testing
      'Side panel: Empty state', // Behaviour-centric
      'Side panel: Example: scrollable content', // Behaviour-centric
      'Side panel: Example: scrollable page', // Behaviour-centric
      'Side panel: Responsive custom layout', // Behaviour-centric
      'Side panel: Responsive layout', // Behaviour-centric
      'Side panel: Responsive mode', // Behaviour-centric
      'Table: Sample: Dropdown', // Complex usage demo
      'Table: Sample: Popover and Dropdown', // Complex usage demo
      'Tabs: Sample: disabled tab with popover', // API specifics can be covered by unit or E2E testing
      'Tabs: Sample: Intercepting tab changes', // Behaviour-centric
      'Toast: As a service', // API specifics can be covered by unit or E2E testing
      'Toast: Timeout', // Behaviour-centric
      'Tooltip: Custom Content', // API specifics can be covered by unit testing
      'Tooltip: Standard', // Already covered in types
      'Tooltip2: Custom Content', // API specifics can be covered by unit testing
      'Tooltip2: Standard', // Already covered in types
      'Vertical Nav: Footer: Scrollable page', // Already covered in scrollable content
      'Wizard: Disabled nav steps', // Behaviour-centric
      'Wizard: Intercepting step changes', // Behaviour-centric
      'Wizard: Sample: Help Card', // Already covered in Overlay
    ]
  }
}
