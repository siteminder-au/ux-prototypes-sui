import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
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
