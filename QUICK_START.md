# Quick Start Guide

## ✅ Setup Complete!

Your Web Components build is ready. Here's how to use it:

## 🌐 View Your Prototype

**Server is running at:** http://localhost:3000

**Open your prototype at:** http://localhost:3000/prototypes/example-prototype

> Note: The `.html` extension is automatically stripped for clean URLs

## 🎯 What's Working

The build system successfully converted your SUI Vue3 components to Web Components:

- ✅ Build completed: `dist/sui-components.js` (158KB)
- ✅ Styles extracted: `dist/style.css` (30KB)
- ✅ Components registered: `sui-button`, `sui-badge`

## 📝 Creating New Prototypes

1. Create a new HTML file in `prototypes/` folder
2. Include the CSS and JS:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="../dist/style.css">
</head>
<body>
  <sui-button type="primary">Click Me</sui-button>

  <script type="module" src="../dist/sui-components.js"></script>
</body>
</html>
```

## 🔧 Adding More Components

Currently only `sui-button` and `sui-badge` are included. To add more:

1. Edit `web-components-build/src/register-components.ts`
2. Import the Vue component:
   ```typescript
   import SmCardComponent from '../../sui-vue3/libs/sui-core/src/app/components/sm-card/sm-card.vue'
   ```
3. Convert to custom element:
   ```typescript
   const SuiCard = defineCustomElement(SmCardComponent)
   ```
4. Register it:
   ```typescript
   if (!customElements.get('sui-card')) {
     customElements.define('sui-card', SuiCard)
   }
   ```
5. Rebuild:
   ```bash
   cd web-components-build
   npm run build
   ```

## 🔄 Updating Components

When you update your `sui-vue3` library:

```bash
cd web-components-build
npm run build
```

All prototypes automatically use the updated components!

## 🚀 Development Workflow

### Watch mode for rapid iteration:
```bash
cd web-components-build
npm run dev
```

This rebuilds automatically when you change component files.

### Start local server:
```bash
npx serve . -p 3000
```

Then open: http://localhost:3000/prototypes/example-prototype.html

## 📦 Available Components

Currently registered:
- `<sui-button>` - Button component with types: primary, secondary, danger
- `<sui-badge>` - Badge component with types: success, warning, danger

## 🎨 Component Props

Props are passed as attributes (use kebab-case):

```html
<sui-button type="primary" disabled>Button</sui-button>
```

Or via JavaScript properties:

```javascript
const button = document.querySelector('sui-button')
button.type = 'secondary'
```

## 📚 Next Steps

1. Add more components from `sui-vue3/libs/sui-core/src/app/components/`
2. Create multiple prototypes for different UX flows
3. Share prototypes with stakeholders (just share the HTML files)

## 🐛 Troubleshooting

**Components not rendering?**
- Check browser console for errors
- Ensure you're using a local server (not file://)
- Verify the build completed successfully

**CORS errors?**
- Always use a local server like `npx serve .`
- Don't open files directly with file:// protocol

**Styles not applying?**
- Make sure `<link rel="stylesheet" href="../dist/style.css">` is in the HTML
- Web Components use Shadow DOM - some global styles may not apply
