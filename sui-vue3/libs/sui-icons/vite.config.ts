import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path'
import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    /**
     * Inline the CSS in the bundled JS file to mimic Vue2 build.
     * Without this it will create a separate sui-icons.esm.css.
     * Unlike the sui-core library, icons isn't configured to import the css separately
     *
     * For instance:
     *
     * import SuiCore from '@siteminder/sui-core'
     * import '@siteminder/sui-core/sui-core.esm.css'
     *
     * import SuiIcons from '@siteminder/sui-icons'
     */
    cssInjectedByJsPlugin(),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/app/index.ts'),
      // the proper extensions will be added
      formats: ['es'],
      // TODO: in vue3 we should just simplify the filename and call it sui-icons.mjs
      // where .mjs indicates that it is file containing ESM syntax
      // see: https://stackoverflow.com/questions/57492546/what-is-the-difference-between-js-and-mjs-files
      // name it the same as before for backwards compatibility (sui-icons.esm.js)
      // fileName: 'sui-core', // vite automatically gives it an .mjs suffix!
      // TODO: remove this once all teams are on vue3
      fileName: () => ('sui-icons.esm.js'),
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      output: {
        assetFileNames: 'sui-icons.esm.[ext]',
        globals: {
          vue: 'Vue',
        },
      },
      external: ['vue'],
      plugins: [
        typescript({
          check: false,
          tsconfig: path.join(process.cwd(), 'tsconfig.build.json'),
        }),
        copy({
          targets: [
            { src: 'dist/sui-icons.esm.js', dest: 'dist', rename: 'sui-icons.mjs' },
          ],
          // see: https://github.com/vitejs/vite/issues/1231#issuecomment-753549857
          // output generation hooks: https://rollupjs.org/plugin-development/#output-generation-hooks
          hook: 'writeBundle',
        }),
      ],
    },
  },
})
