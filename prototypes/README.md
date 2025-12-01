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
