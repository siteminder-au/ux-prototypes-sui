import { DocsPage } from "@storybook/addon-docs"
import { app } from '@storybook/vue3'
import { createI18n } from 'vue-i18n'
import theme from './theme.cjs'
import './theme.scss'
import './theme-vue3.scss'
import SuiCore from '../libs/sui-core/src/app'
import SuiIcons from '../libs/sui-icons/src/app'
// Add to test theming overrides
// import '../libs/sui-themes/src/app/index'
// import '../theming-test.css' // should be compatible with sui-themes and co-located sui-core
import './tailwind.css'

import {
  SuiStorybookH1,
  SuiStorybookH2,
  SuiStorybookH3,
  SuiStorybookH4,
  SuiStorybookH5,
  SuiStorybookH6,
  SuiStorybookPageLabel,
  SuiStorybookParagraph,
  SuiStorybookTable,
  SuiStorybookTitle,
} from '@/components'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false
})

app.use(i18n)
app.use(SuiCore, { i18n })
app.use(SuiIcons)

// ensure that the whitespace is preserved to minimise changes between vue2 and vue3 storybook
// see: https://stackoverflow.com/questions/69055857/preserve-whitespace-between-spans-in-vue
// but it doesn't seem to work for all cases
// check back again when this issue is resolved: https://github.com/storybookjs/storybook/issues/18288
app.config.compilerOptions.whitespace = 'preserve'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    expanded: true,
    sort: 'requiredFirst',
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    /**
     * Doesn't work with current setup of mixing .ts and .mdx files.
     * See https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#sorting-stories
     * Atm, stories are sorted alphabetically by default and by file type in `main.cjs`
     */
    storySort: {
      method: 'alphabetical',
    },
  },
  docs: {
    page: DocsPage,
    components: {
      // Add wrapper component to native elements so we can add our own, pre-defined
      // styles to the mdx syntax and override the Storybook defaults
      h1: SuiStorybookH1,
      h2: SuiStorybookH2,
      h3: SuiStorybookH3,
      h4: SuiStorybookH4,
      h5: SuiStorybookH5,
      h6: SuiStorybookH6,
      p: SuiStorybookParagraph,
      table: SuiStorybookTable,
      SuiStorybookPageLabel,
      SuiStorybookTitle,
    },
    theme,
  },
}
