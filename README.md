# SUI Prototyping Environment

A Vue 3-based prototyping environment for testing and demonstrating SUI components.

## Quick Start

```bash
cd prototypes
npm install
npm run dev
```

Open http://localhost:3001

## Structure

```
prototyping-stub/
├── package.json        # Root orchestrator for Heroku
├── Procfile           # Heroku deployment config
└── prototypes/        # Vue prototyping environment
    ├── src/
    │   ├── App.vue                  # Navigation
    │   ├── prototypes/
    │   │   ├── _template/           # Template for new prototypes
    │   │   ├── component-showcase/  # SUI component demo
    │   │   └── example-multi-file/  # Multi-file prototype example
    │   └── shared/                  # Shared components
    ├── dist/                        # Build output (committed for Heroku)
    └── node_modules/sui-vue3/       # SUI library (npm dependency)
```

## Features

- **Vue 3 + Vite** - Fast development with HMR
- **jQuery Support** - For rapid prototyping with DOM manipulation
- **SUI Components** - Direct access to all SUI Vue components from npm
- **Multi-file Prototypes** - Break complex prototypes into multiple components
- **Simple Navigation** - Switch between prototypes with one click
- **Heroku Ready** - Pre-configured for easy deployment

## Creating a New Prototype

See [prototypes/README.md](prototypes/README.md) for detailed instructions.

Quick version:
1. Copy `src/prototypes/_template` to a new folder
2. Add it to `src/App.vue`
3. Start building!

## Deployment

**Live App:** https://sui-vue-prototypes-5aa2fd81c980.herokuapp.com/

### Deploy to Heroku

```bash
cd prototypes
npm run build          # Build the app
cd ..
git add .
git commit -m "Your changes"
git push origin main   # Push to GitHub
git push heroku main   # Deploy to Heroku
```

### How It Works

- SUI components are installed from `github:siteminder-au/sui#vue3` as an npm dependency
- Build output is committed to git (in `prototypes/dist/`)
- Heroku serves pre-built static files (no build step on Heroku)
- Tree-shaking reduces bundle size to ~370KB (126KB gzipped)

### Updating SUI Library

```bash
cd prototypes
npm update sui-vue3    # Updates to latest vue3 branch
npm install
npm run build
# Then commit and deploy
```
