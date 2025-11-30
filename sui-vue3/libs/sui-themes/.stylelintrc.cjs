module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss'
  ],
  rules: {
    'alpha-value-notation': 'number',
    // We need to check if we can safely use the new "context" syntax because
    // it may not be widely supported yet https://drafts.csswg.org/mediaqueries/#mq-range-context
    'media-feature-range-notation': 'prefix',
    // TODO: Add these back in batches so we don't introduce massive CSS changes
    // in https://siteminder-jira.atlassian.net/browse/SUI-2275
    // Especially since we still don't have Percy coverage on other browsers and sui-themes
    // Anything that changes the specificity or selectors can introduce breaking changes between related libraries
    'at-rule-no-vendor-prefix': [true, { severity: 'warning' }],
    'color-function-notation': ['legacy', { severity: 'warning' }], // Check which one is better between modern and legacy
    'declaration-block-no-duplicate-properties': [true, { severity: 'warning' }],
    'declaration-block-no-redundant-longhand-properties': [true, { severity: 'warning' }],
    'declaration-block-no-shorthand-property-overrides': [true, { severity: 'warning' }],
    'font-family-no-duplicate-names': [true, { severity: 'warning' }],
    'import-notation': 'string', // Check which one is better between url and string
    'keyframes-name-pattern': null, // Enforce regex
    'no-descending-specificity': [true, { severity: 'warning' }],
    'no-duplicate-selectors': [true, { severity: 'warning' }],
    'property-no-vendor-prefix': [true, { severity: 'warning' }], // Cleanup will require more involved testing
    'scss/at-mixin-pattern': null, // Enforce regex
    'scss/dollar-variable-pattern': null, // Enforce regex
    'scss/no-global-function-names': [true, { severity: 'warning' }], // Expected map.get instead of map-get errors
    'selector-class-pattern': null, // We use BEM in SiteMinder but check if we can enforce regex
    'selector-no-vendor-prefix': [true, { severity: 'warning' }],
    'selector-not-notation': ['simple', { severity: 'warning' }], // Check which one is better between simple and complex
    'selector-pseudo-class-no-unknown': [true, { severity: 'warning' }],
    'selector-pseudo-element-no-unknown': [true, {
      // 'ignorePseudoElements': ['v-deep'], // We can ignore v-deep, but we eventually want to remove these overrides
      severity: 'warning'
    }],
    'value-keyword-case': ['lower', {
      camelCaseSvgKeywords: true, // currentColor vs currentcolor, it seems that some browsers are case sensitive so this needs further investigation
      severity: 'warning'
     }],
  },
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],
      extends: [
        // See https://github.com/ota-meshi/stylelint-config-recommended-vue
        'stylelint-config-standard-vue/scss'
      ]
    }
  ]
}
