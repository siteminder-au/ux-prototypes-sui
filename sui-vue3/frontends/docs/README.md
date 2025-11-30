# SUI Storybook

Welcome to the Vue3 SUI Design System powered by Storybook!

This project serves as a living documentation and development environment for UI
components that adhere to our design guidelines.

# Running Locally
Go to the `frontends/docs` directory first

Run the following on your initial setup, or when updating dependencies and the like. You don't have to run them every time since the files from `libs/` folder
will be symlinked.

```bash
# Install the dependencies
nvm use
npm i

# Compile the libs
npm run compile

# Or compile specific libs only
npm run compile-core
npm run compile-icons
npm run compile-theming
```

And then run the server

```bash
npm run dev
```

The docs site will be available at http://localhost:6006/

To verify the production build of Storybook, run the following:

```bash
npm run compile
npx http-server build -o
```

## Technical Overview

The documentation site leverages the [Storybook framework](https://storybook.js.org/), along with various add-ons.

The `sui-core` and `sui-icons` libraries are already configured in [.storybook/preview.cjs](.storybook/preview.cjs).

If you need to test `sui-themes`, add the following lines (but don't commit it):

```js
// Add to test theming overrides
import '../libs/sui-themes/src/app/index'
import '../theming-test.css'
```

## Writing Docs

The general/UI/UX documentation files are under `frontend/docs`.

On the otherhand, the component documentation files are written next to their associated components inside of the `libs/sui-core` directory, in `*.stories.(ts|mdx)` files.

### Folder structure

For the Vue 3 version, story files are stored under `__stories__` folder.

For instance:

- sui
  - frontends
    - docs/src/
      - **\_\_stories\_\_** (General docs story files live here)
  - libs
    - sui-core
      - src/app/components/
        - sm-404-page
          - **\_\_stories\_\_** (Component docs story files live here)
        - ... and more

Create, move or copy around files if you need to add docs into Vue 3 Storybook.

To write a story, follow the official guides:
- https://storybook.js.org/docs/vue/writing-stories/introduction
- https://storybook.js.org/docs/vue/api/csf

### Updating existing stories

Files are named appropriately, e.g if the page is titled “Typography”, then the first thing to look for is `typography.stories`.

Stick to this naming convention if you intend to edit titles or add a new one.

### Adding a component story

The interactive component demos are written in `*.stories.ts` files.

To add a new story, create a `my-component.stories.ts` file next to the associated Vue component.

#### Annotating component features

The doc site will automatically add a documentation table for your component's features such as `props`, `slots` and events emitted.

These tables can be annotated using the syntax provided by the [vue-docgen-api](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-docgen-api).

For example:

```typescript
export default {
  props: {
    /**
     * Whether the button is clickable
     */
    disabled: { type: Boolean, default: false },
  },
  emits: [
    /**
     * Emitted when the button is clicked
     */
    click,
  ],
},
```

```html
<!-- @slot The button content -->
<slot />
```

The description provided in the document block will be picked up and included in the `ArgsTable` of the component in Storybook.


### Adding UI/UX docs

The static docs are written in MDX (Markdown and JSX). See [MDX table of components](https://mdxjs.com/table-of-components/) to help you get started.

SUI Storybook is already configured to apply the styles to the most basic elements you'll need: headings, paragraphs, tables, etc.

```mdx
# Heading 1

Anchored table of contents

- [Heading 2](#heading-2)
- [Heading 2 with more text!](#heading-2-with-more-text!)

## Heading 2

Headings have been configured to apply `id` attribute whose value is the text itself in lowercase and kebab-case.
Thus, it is important to keep your headings unique on each page.

This allows them to be anchored in the table of contents.

## Heading 2 with more text!

| Header | Header |
| --- | --- |
| Cell | Cell |

```

If you need further customizations you can add a `style` section and write the JSX.

```JSX
import importedImageName from './images/some-image.png'

<style>
  {`
    .my-custom-class {
      color: blue;
    }
  `}
</style>

<span className="my-custom-class">Text in blue via style tag above</span>

<img src={importedImageName} alt="Some image" />
```

Note the `className` JSX syntax above.

#### Utility components and classes

We also have some utility components and classes to standardize the look of our docs:

**Titles**

Please use the syntax below to add the title:

```HTML
<SuiStorybookPageLabel>Guides</SuiStorybookPageLabel>

<SuiStorybookTitle>
  <h1>White labelling</h1>
  <p>
    Our app header can be themed to help support our partner customers.
  </p>
</SuiStorybookTitle>
```

**Highlights**

```HTML
<div className="sui-storybook-highlight">Info highlight</div>
<div className="sui-storybook-highlight sui-storybook-highlight--warning">Warning highlight</div>
<div className="sui-storybook-highlight sui-storybook-highlight--alert">Alert highlight</div>
```

Please see [theme.scss](.storybook/theme.scss) and [theme-vue3.scss](.storybook/theme-vue3.scss) for all classes available.

### Template/guides

You can use the following as guides:
- For Foundations or Guides docs see `1-spacing-overview.stories.mdx`
- For Components docs see `1-sm-404-page-overview.stories.mdx`

And then you'll need to adjust these things as needed:

**For UI/UX docs (`.stories.mdx`)**

```JSX
<Meta title="Foundations/Typography" />
```

Where `Foundations` is the root title in the sidebar and `Typography` is the group name

```JSX
<Story name="Overview" ... ></Story>
```

Where the `Overview` is the title of the story.

**For component demos (`.stories.ts`)**

```TS
export default {
  title: 'Components/Card',
  // ...
}
```

Where `Components` is the root title in the sidebar and `Card` is the component or group name

### Grouping and ordering stories

The grouping and hierarchy of the stories are handled by the meta tags explained above.

And the default ordering is by folder structure then alphabetical.

To override the alphabetical ordering of the stories in the sidebar, prefix the file names with numbers.

For instance:
- `1-colour-overview.stories.mdx`
- `2-colour-accessibility.stories.mdx`

To make the "Overview" docs appear before "Accessibility".

For consistency, always prefix the MDX files with numbers.

References:
- https://storybook.js.org/docs/6.5/vue/writing-stories/naming-components-and-hierarchy

# Visual Testing via Percy

## Prerequisites
You must complete these first before attempting to run any of the Percy commands:
- You must have an Automate account on BrowserStack to view the results
- Get PERCY_TOKEN from:
  - https://percy.io/af13c08b/sui-storybook-vue3 (Compare against Vue3 base)
  - https://percy.io/af13c08b/sui-storybook (Compare against Vue2 base)
- Copy the PERCY_TOKEN and add it directly in your command when running Percy, like so:

  ```
  PERCY_TOKEN=<percy_token> <percy_command>
  ```

## Running against dev Storybook

This will take snapshots in:
- Vue2: https://sui-dev-sui-docs.dev.siteminderlabs.com/
- Vue3: https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/

**IMPORTANT:** Run the following command in a `non-master` and `non-vue3` branch (e.g. my-branch-123).
Running it in `master` and `vue3` will auto-approve the build and update the base snapshots which we **DON'T** want to do unless we're updating the base screenshots.

```bash
npm run percy:dev # Vue2, or
npm run percy:vue3 # Vue3
```

Then wait for the command to finish and click on the build link.

## Running against prod Storybook (Vue2 only)

This will take snapshots in https://sui.siteminder.systems/

**_NOTE: Only do this if you want to regenerate the base snapshots that we compare against_**

Run the following command while you are in the `master` branch

```bash
npm run percy:prod
```

Then wait for the command to finish and click on the build link.

## Running against local Storybook (Vue2)

This will only work in Vue2 Storybook version. See steps below for the Vue3.

This will take snapshots in `localhost` so you'll need to start up the Storybook local server first (`npm run dev`).

**IMPORTANT:** Run the following command in a `non-master` and `non-vue3` branch (e.g. my-branch-123).
Running it in `master` and `vue3` will auto-approve the build and update the base snapshots which we **DON'T** want to do unless we're updating the base screenshots.

```bash
npm run percy:local
```

Then wait for the command to finish and click on the build link.

## Running against locally compiled Storybook

This will compile the SUI libs first and run Percy against the build folder.

Use this when you want to run it against your local vue3 changes. The `:local` script above is not fully compatible with Storybook 6.

**IMPORTANT:** Run the following command in a `non-master` and `non-vue3` branch (e.g. my-branch-123).
Running it in `master` and `vue3` will auto-approve the build and update the base snapshots which we **DON'T** want to do unless we're updating the base screenshots.

```bash
npm run percy:local-build
```

Wait for the command to finish and click on the build link.

## Other configs

You can look into `.percy.js` to find the global configs.

In addition, you can pass other Percy CLI arguments in the npm scripts above.

For instance, `npm run percy:dev -- --dry-run` if you want to verify the run without
generating a build for it.

See available commands in https://www.browserstack.com/docs/percy/take-percy-snapshots/snapshots-via-scripts#commands.

## Percy CSS utility classes

To optimize the screenshots, we can use CSS utility classes in `frontends/docs/.storybook/preview-head.html`.

More details on this in https://docs.percy.io/docs/percy-specific-css#percy-css-media-query-for-storybook.

## Additional setup before taking screenshot

If you need to do additional setup on the stories, like opening a popover before taking a screenshot, consider initializing the relevant state using the component props if available.

If it isn't, programmatically trigger the needed actions, usually on `onMounted` hook.
You can limit the execution by checking the `isPercy=true` query params first, because sometimes it makes more sense for the live demos to start on the default state and let the users interact with it.

In addition, you might need to add the following in the story parameters:

```ts
percy: {
  enableJavascript: true,
},
```

See `sm-popover.stories.ts` for an example.

# npm packages not to be updated (yet) - vue3
- **"@storybook/*": ">6.5.16",**
  - contains several breaking changes.
  - will be looked into this [initiative](https://siteminder-jira.atlassian.net/browse/SUIR-69)
- **"vite": ">=4.5.1",**
  - currently gives an error: "ReferenceError: React is not defined"
  - we may need to upgrade storybook to >=v7 first before upgrading vite v4 and above.
- **"@storybook/builder-vite": ">=0.4.2"**
  - requires vite v4 and above
- **"@vitejs/plugin-vue": ">=4.6.2",**
  - requires vite v4 and above
- **"vue": ">3.3.13",**
  - requires vite v5 and above
