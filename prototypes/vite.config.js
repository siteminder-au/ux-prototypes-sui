import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Plugin to handle the problematic floating-vue CSS import from sm-tooltip
function floatingVueWorkaround() {
  return {
    name: 'floating-vue-workaround',
    enforce: 'pre',
    transform(code, id) {
      // Intercept sm-tooltip.vue and remove the problematic CSS import
      if (id.includes('sm-tooltip/sm-tooltip.vue')) {
        // Replace the @import with a comment since we import it globally
        const modifiedCode = code.replace(
          /@import\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/node_modules\/floating-vue\/dist\/style\.css['"];?/g,
          '/* floating-vue styles imported globally in main.js */'
        )
        return {
          code: modifiedCode,
          map: null
        }
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [vue(), floatingVueWorkaround()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@sui': resolve(__dirname, './node_modules/sui-vue3/libs/sui-core/src'),
      '@sui-icons': resolve(__dirname, './node_modules/sui-vue3/libs/sui-icons/src'),
      'lodash': 'lodash-es'
    }
  },
  server: {
    port: 3001
  }
})
