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
    // 'color-function-notation': ['legacy', { severity: 'warning' }], // Check which one is better between modern and legacy
    // 'import-notation': 'string', // Check which one is better between url and string
    // 'keyframes-name-pattern': null, // Enforce regex - sync with other libs
    // 'scss/at-mixin-pattern': null, // Enforce regex - sync with other libs
    // 'scss/dollar-variable-pattern': null, // Enforce regex - sync with other libs
    'selector-class-pattern': null, // We use BEM in SiteMinder but check if we can enforce regex
    // 'selector-not-notation': ['simple', { severity: 'warning' }], // Check which one is better between simple and complex
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
