# sui-themes

This library contains the theming overrides for the `sui-core` components.

A theme can be thought of as a set of variables or 'global tokens' applied across your components. It encompasses all colors, spacing units, and typography rules, defining the overall look and feel of your components. This approach allows you to create tailored and accessible experiences.

See [Theming Overview](https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/?path=/story/guides-theming-overview--page) for more details.

#### Installation and Use

**_Installation_**

To install @siteminder/sui-themes in your project, you will need to run the following command using npm:

```bash
npm i @siteminder/sui-themes@latest
```

**_Create a CSS file_**

Update CSS variables in your project, e.g.

```bash
sui-variables.css
```

Follow the [Installation guide](https://sui.siteminder.systems/?path=/story/theme-guides-setup--install)

sui-themes is written in CSS and constructed using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)(also referred to as CSS variables or cascading variables). If your project uses CSS/SCSS, you can directly change SUI’s theme variables.


By default, @siteminder/sui-themes provide a set of design tokens that are pre-defined for SUI to enable customization.


**_Update the project entry-level file_**

```ts
import { createApp } from 'vue'

import SuiCore from "@siteminder/sui-core"
import "@siteminder/sui-core/sui-global.css"

// Theming layer
import '@siteminder/sui-themes/sui-theme.esm.css'
import './sui-variables.css' // Your FE's token definitions

import { i18n } from "@/services/i18n"

const app = createApp({
  /* ... */
})

app.use(SuiCore, { i18n })
```
