import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    emptyOutDir: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/app/index.ts'),
      // the proper extensions will be added
      formats: ['es'],
      fileName: () => ('sui-theme.esm.js'),
    },
    rollupOptions: {
      output: {
        assetFileNames: 'sui-theme.esm.[ext]',
      },
    },
  },
  plugins: [
    copy({
      /**
       * Copy static file to mimic Vue2
       * The extra writeBundle hook below is needed as per
       * https://github.com/vitejs/vite/issues/1231#issuecomment-753549857
      */
      targets: [
        { src: 'src/app/common/variables.scss', dest: 'dist/variables' },
        { src: 'dist/sui-theme.esm.js', dest: 'dist', rename: 'sui-theme.mjs' },
        { src: 'dist/sui-theme.esm.css', dest: 'dist', rename: 'sui-theme.css' },
      ],
      hook: 'writeBundle',
    }),
  ],
})
