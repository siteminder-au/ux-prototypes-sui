# SUI Vue Prototypes

A prototyping environment for SUI components using Vue 3, Vite, and jQuery.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3001

## Creating a New Prototype

### Option 1: Simple prototype (single file)

1. Copy the template:
   ```bash
   cp -r src/prototypes/_template src/prototypes/my-new-prototype
   ```

2. Rename `PrototypeTemplate.vue` to something meaningful like `MyNewPrototype.vue`

3. Add it to `src/App.vue`:
   ```javascript
   import MyNewPrototype from './prototypes/my-new-prototype/MyNewPrototype.vue'

   const prototypes = [
     { id: 'home', name: 'Home', component: ComponentShowcase },
     { id: 'my-new', name: 'My New Prototype', component: MyNewPrototype },
   ]
   ```

4. Start editing your prototype!

### Option 2: Complex prototype (multiple files)

For complex prototypes with multiple components:

```
src/prototypes/checkout/
├── Checkout.vue          (main entry point)
├── CartSummary.vue
├── PaymentForm.vue
└── ShippingForm.vue
```

Then import the main file in `App.vue`.

## Available Tools

- **Vue 3** - Modern reactive framework
- **jQuery** - For quick DOM manipulation and animations
- **SUI Components** - All components from `@sui/app/components/`
- **SUI Icons** - Icon component registered globally as `sm-icon`

## Folder Structure

```
vue-prototypes/
├── src/
│   ├── App.vue                  # Navigation between prototypes
│   ├── main.js                  # App entry point
│   ├── prototypes/
│   │   ├── _template/           # Copy this for new prototypes
│   │   └── component-showcase/  # Example prototype
│   └── shared/                  # Shared components/utilities
├── package.json
└── vite.config.js
```

## Tips

- jQuery is available globally as `$` in all components
- Import SUI components from `@sui/app/components/[component-name]/[component-name].vue`
- Use `sm-icon` component for icons (already registered globally)
- Prototypes are isolated - break them up into sub-components as needed
- Use the `shared/` folder for components used across multiple prototypes

## Using SUI Form Components

SUI form components (SmInput, SmSelect, SmFormGroup) integrate with vee-validate and vue-i18n. Follow these requirements:

### 1. All form inputs require a `name` prop
```vue
<!-- ✅ Correct -->
<SmInput name="email" v-model="formData.email" />

<!-- ❌ Will cause vee-validate errors -->
<SmInput v-model="formData.email" />
```

### 2. SmSelect requires the `options` prop
SmSelect uses vue-multiselect, which needs an array of objects with `label` and `code` properties:

```vue
<script setup>
const inclusionOptions = [
  { label: 'Breakfast', code: 'breakfast' },
  { label: 'WiFi', code: 'wifi' }
]

const formData = ref({
  inclusions: null  // Initialize as null, not empty string
})
</script>

<template>
  <SmSelect
    name="inclusions"
    v-model="formData.inclusions"
    :options="inclusionOptions"
    placeholder="Select inclusions"
    allow-empty
  />
</template>
```

**Note:** Native `<option>` tags don't work with SmSelect.

### 3. Dependencies
- **vue-i18n@9** - Required for SUI component translations
- **vee-validate@4** - Required for form validation
- **patch-package** - Maintains SmSelect CSS fix across installs

These are automatically configured in `main.js`.

## Deployment Workflow

This project is configured for Heroku deployment with a pre-build approach:

1. **Develop** - Make changes and test locally with `npm run dev`
2. **Build** - Run `npm run build` to create production bundle in `dist/`
3. **Commit** - Commit changes including the `dist/` folder
4. **Deploy** - Push to Heroku with `git push heroku main`

The `dist/` folder is tracked in git to avoid GitHub authentication issues on Heroku.

## SUI Component Library

- Installed as npm dependency: `sui-vue3: "github:siteminder-au/sui#vue3"`
- Located in `node_modules/sui-vue3/`
- Aliased in Vite config as `@sui` and `@sui-icons`
- Update with `npm update sui-vue3`
