import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {}
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      },
      customElement: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/register-components.ts'),
      name: 'SuiComponents',
      fileName: 'sui-components',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Bundle all dependencies
      external: [],
      output: {
        // Output to parent dist folder
        dir: resolve(__dirname, '../dist'),
        // Provide global variables for UMD build
        globals: {},
        // Inline dynamic imports
        inlineDynamicImports: false
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    cssCodeSplit: false,
    outDir: '../dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../sui-vue3/libs/sui-core/src')
    }
  }
})
