import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@sui': resolve(__dirname, '../sui-vue3/libs/sui-core/src'),
      '@sui-icons': resolve(__dirname, '../sui-vue3/libs/sui-icons/src')
    }
  },
  server: {
    port: 3001
  }
})
