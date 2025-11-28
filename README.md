# SUI Vue3 Web Components Prototyping Environment

This repository provides a setup to convert your existing SUI Vue3 component library into Web Components for easy prototyping in static HTML files.

## Structure

```
/prototyping-stub/
├── sui-vue3/                       # Your existing Vue 3 component library
├── web-components-build/           # Build configuration for Web Components
│   ├── src/
│   │   └── register-components.ts  # Component registration wrapper
│   ├── vite.config.ts              # Vite build config
│   └── package.json
├── dist/                           # Built Web Components output
│   └── sui-components.js
└── prototypes/                     # Your HTML prototypes
    └── example-prototype.html
```

## Setup

### Option 1: Quick Setup (Recommended)

```bash
./setup.sh
```

### Option 2: Manual Setup

1. Install dependencies:
```bash
cd web-components-build
npm install
```

2. Build the Web Components:
```bash
npm run build
```

This will compile your Vue components into Web Components and output them to:
- `dist/sui-components.js` - JavaScript bundle
- `dist/style.css` - Component styles

3. Start a local server:
```bash
npx serve . -p 3000
```

4. Open in browser:
http://localhost:3000/prototypes/example-prototype

**⚠️ Important:**
- Always use a local server (not file://) to avoid CORS errors
- The `.html` extension is automatically stripped by the server for clean URLs

## Usage

### Adding More Components

To expose more components from your sui-vue3 library:

1. Edit [web-components-build/src/register-components.ts](web-components-build/src/register-components.ts)
2. Import the component from sui-core
3. Wrap it with `defineCustomElement()`
4. Register it with `customElements.define()`
5. Rebuild with `npm run build`

Example:

```typescript
import { SmTable } from '../../sui-vue3/libs/sui-core/src/app/components/sm-table'

const SuiTable = defineCustomElement(SmTable)
customElements.define('sui-table', SuiTable)
```

### Creating New Prototypes

Just create a new HTML file in the `prototypes/` directory:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Include component styles -->
  <link rel="stylesheet" href="../dist/style.css">
</head>
<body>
  <sui-button type="primary">Click Me</sui-button>

  <!-- Include component JavaScript -->
  <script type="module" src="../dist/sui-components.js"></script>
</body>
</html>
```

### Updating the Component Library

When you update sui-vue3:

1. Make changes in the `sui-vue3/` directory
2. Rebuild the Web Components: `cd web-components-build && npm run build`
3. Your prototypes will automatically use the updated components

## Development Workflow

### Watch mode for rapid iteration

```bash
cd web-components-build
npm run dev
```

This will watch for changes and rebuild automatically.

### Serving prototypes locally

Use any static file server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code Live Server extension
```

Then open `http://localhost:8000/prototypes/example-prototype.html`

## Notes

- Web Components use Shadow DOM, so global CSS may not apply. Include necessary styles in the prototype HTML.
- Props are passed as attributes (kebab-case) or properties (JavaScript)
- Events are dispatched as custom events
- Slots work as expected with `<slot>` elements
