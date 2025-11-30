const { mergeConfig } = require('vite');
const path = require('path')

module.exports = {
  "stories": [
    // Set mdx as the default/first page
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    // only show stories inside __stories__ folder
    // there are stories outside of __stories__ folder
    // that are not compatible in vue3 world yet.
    "../libs/**/sm-form/__stories__/*.stories.@(mdx|ts)", // Move sm-form stories to the top of the "Form" group
    "../libs/**/__stories__/*.stories.mdx",
    "../libs/**/__stories__/*.stories.@(js|jsx|ts|tsx)",
    "../samples/__stories__/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "storybook-addon-designs"
  ],
  staticDirs: ['../public'],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "@storybook/builder-vite",
    "disableTelemetry": true,
  },
  "features": {
    "storyStoreV7": true
  },
  async viteFinal(config, options) {
    if (process.env.NODE_ENV !== 'production')
      config.server.fs.strict = false;
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      define: {
        // remove local development console warning from runtime-core.esm-bundler.js from vue 3.4 onwards
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      },
      // Use the same "resolve" configuration as your app
      resolve: {
        ...(await import('../vite.config.js')).default.resolve,
        alias: {
          // Compile .stories.(mdx|ts) files added outside of frontend/docs
          '@storybook/addon-docs': path.resolve(__dirname, '../node_modules/@storybook/addon-docs'),
          '@mdx-js/react': path.resolve(__dirname, '../node_modules/@storybook/addon-docs/node_modules/@mdx-js/react'),
          'storybook-vue3-router': path.resolve(__dirname, '../node_modules/storybook-vue3-router'),
          // see: https://github.com/nrwl/nx/issues/17156
          // required so storybook knows how to resolve some imports from v-calendar package
          'v-calendar/dist/types/src/utils/page.js': path.resolve(__dirname, '../libs/sui-core/node_modules/v-calendar/dist/types/src/utils/page.d.ts'),
          'v-calendar/dist/types/src/utils/date/range.js': path.resolve(__dirname, '../libs/sui-core/node_modules/v-calendar/dist/types/src/utils/date/range.d.ts'),
          // Import shortcuts
          '@': path.resolve(__dirname, '../src'),
        },
      },
      // Add dependencies to pre-optimization

    });
  },
}
