import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// Auto-discover prototypes
const prototypesDir = resolve(__dirname, 'src/prototypes')
const prototypes = readdirSync(prototypesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
  .map(dirent => dirent.name)

// Build multi-page input configuration
const input = {
  main: resolve(__dirname, 'index.html')
}

// Add each prototype as a page
prototypes.forEach(proto => {
  input[`prototypes/${proto}/index`] = resolve(__dirname, `prototypes/${proto}/index.html`)
})

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@sui': resolve(__dirname, '../sui-vue3/libs/sui-core/src'),
      '@sui-icons': resolve(__dirname, '../sui-vue3/libs/sui-icons/src')
    }
  },
  server: {
    port: 3001
  },
  build: {
    rollupOptions: {
      input
    }
  }
})
