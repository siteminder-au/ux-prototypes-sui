import { create } from '@storybook/theming/create';
import suiLogo from './sui-logo.svg';

/**
 * See https://storybook.js.org/docs/vue/configure/theming for official docs
 * This is pretty limited, but further customizations can be done as per
 * https://storybook.js.org/docs/vue/configure/theming#css-escape-hatches
 */
export default create({
  base: 'light',
  brandTitle: 'SiteMinder | SUI - Vue 3',
  brandUrl: 'https://github.com/siteminder-au/sui/tree/vue3',
  brandImage: suiLogo,

  // Colors
  colorPrimary: '#006add',
  colorSecondary: '#006add',

  // UI
  appBg: '#f5f9ff',
  appContentBg: '#ffffff',

  // Typography
  fontBase: '"Noto Sans", Helvetica, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#333333',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#828ea3',
  barSelectedColor: '#006add',
  barBg: '#ffffff',
})
