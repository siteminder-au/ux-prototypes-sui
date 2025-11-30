// eslint error import/no-extraneous-dependencies
// will be fixed in a future PR
// see: https://stackoverflow.com/questions/44939304/eslint-should-be-listed-in-the-projects-dependencies-not-devdependencies
import dts from 'vite-plugin-dts'
import copy from 'rollup-plugin-copy'
import terser from '@rollup/plugin-terser'
import { globSync } from 'glob'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

const convertToEntryPath = (originalPath: string) => {
  // e.g. "src/app/components/sm-section/index.ts"
  // "components/sm-section/index.ts"
  const relativePath = path.relative('src/app', originalPath)
  // "components/sm-section"
  return relativePath.substring(0, relativePath.lastIndexOf('/'))
}

// https://vitejs.dev/config/
// see: https://vitejs.dev/guide/build.html#library-mode
// see: https://vitejs.dev/config/build-options.html#build-assetsdir
// stop inlining: https://github.com/vitejs/vite/issues/3295
export default defineConfig({
  plugins: [
    // these are shared plugins that usually come from the @vitejs namespace
    vue(),
    libInjectCss(),
    // without dts, then the .d.ts files ts generates (with declaration: true) has generic typing (foo: any)
    dts({
      // see: https://dev.to/nicolaserny/create-a-react-component-library-with-vite-and-typescript-1ih9
      // When `true`, uses package.json `types` property if it exists or `${outDir}/index.d.ts`
      insertTypesEntry: true,
      // we also automatically generate .d.ts files for all imports mentioned in src/app/index.ts
      // we need this include to generate types for exported enums and interfaces,
      // or types that are not mentioned in an index.ts file
      include: [
        // we generate .d.ts files for all .ts/.vue files in the src/app folder
        // to ensure that all types are exposed to downstream projects
        // and mimics the behaviour of setting `declaration: true` in tsconfig.json
        'src/app/**/*.ts',
        'src/app/**/*.vue'
      ],
      // exclude generating .d.ts files for stories and spec files.
      exclude: [
        '**/*.spec.ts',
        '**/*.stories.ts',
        '**/*.stories.deprecated.ts',
        'src/app/samples/**/*.ts',
      ],
    }),
  ],
  build: {
    // NOTE: we have removed babel as we should not need to transpile our js code into older js syntax (i.e. ES5 by default if no `browserslist` key in sui-core package.json is defined) in the final bundle files.
    // later versions of ES spec tend to be more concise and have better performance.
    // we tell vite via `build.target` that we want to transpile `js` code to ES2022 (ES13) which has widespread browser support
    // see: https://caniuse.com/?search=es2022, we can generally assume that all modern browsers support ES2022 and users tend to update their browsers regularly
    // see: https://vitejs.dev/config/build-options#build-target
    // NOTE: ensure that `target` in tsconfig.build.json has the same value as `build.target` in vite.config.ts file for consistency purposes.
    target: 'ES2022',
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        // vite uses the keys here to place the .mjs files in the final build folder (i.e. dist)
        libs: 'src/app/libs/index.ts', // for exposing functions related to vue-i18n and vee-validate
        services: 'src/app/services/index.ts', // for exposing services such as toasts and dialog
        'sui-core': 'src/app/index.ts',
        // e.g. components/sm-button -> src/app/components/sm-button/index.ts
        ...(Object.fromEntries(globSync('src/app/components/**/index.ts').map(file => [convertToEntryPath(file), file]))),
        // Create tree-shakable entry points for each common/global style
        'sui-common': 'src/app/common/libs/sui-common.scss',
        'sui-resets': 'src/app/common/libs/sui-resets.scss',
        'sui-scaffolding': 'src/app/common/libs/sui-scaffolding.scss',
        'sui-typography': 'src/app/common/libs/sui-typography.scss',
        'sui-utilities': 'src/app/common/libs/sui-utilities.scss',
        // the three entry paths below are for backwards compatibility
        // TODO: remove these once we have migrated all downstream projects to vue3
        'components/sm-media2': 'src/app/components/sm-media/index.ts',
        'components/sm-nav2': 'src/app/components/sm-nav/index.ts',
        'components/sm-tooltip2': 'src/app/components/sm-tooltip/index.ts',
      },
      // the proper extensions will be added
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].mjs',
        // Provide global variables to use in the build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
      // make sure to externalize deps that shouldn't be bundled into your library
      // NOTE: we only include selected packages from the `dependencies` in package.json
      external: [
        // we externalize vee-validate and its rules and let the downstream projects
        // install it themselves as they may use it directly in their code.
        '@vee-validate/i18n',
        '@vee-validate/rules',
        'vee-validate',
        'vue',
        'vue-i18n',
        'vue-router'
      ],
      plugins: [
        terser({
          format: {
            // unfortunately, esbuild (default vite minifier) doesn't support
            // stripping all comments.
            // evanw author of esbuild:
            // "Sorry, esbuild is not a comment stripper. Code formatting is not an intended use case for esbuild."
            // - see: https://github.com/evanw/esbuild/issues/3117
            // - see: https://longviewcoder.com/2023/04/19/vite-build-how-to-erase-comments/
            // so we use terser instead to do that job.
            // strip away all comments from the final bundle files
            comments: false,
          },
        }),
        // we tell vite via tsconfig.build.json that we want to transpile `ts` code to ES2022 (ES13) via the `target` key which has widespread browser support
        // see: https://caniuse.com/?search=es2022, we can generally assume that all modern browsers support ES2022 and users tend to update their browsers regularly
        typescript({
          // TODO: set check: true once all type errors are fixed
          check: false,
          tsconfig: path.join(process.cwd(), 'tsconfig.build.json'),
        }),
        // for rollup-plugin-visualizer cli
        visualizer({
          template: 'raw-data',
          filename: 'reports/bundle-report.json',
        }),
        copy({
          targets: [
             // Currently, we are exposing two css files sui-core.esm.css and sui-global.css
             // However we will be Deprecating `sui-core.esm.css` over `sui-global.css` once all team move to `sui-global.css`
            { src: 'dist/sui-core.css', dest: 'dist', rename: 'sui-core.esm.css' },
            { src: 'dist/sui-core.css', dest: 'dist', rename: 'sui-global.css' },
          ],
          // see: https://github.com/vitejs/vite/issues/1231#issuecomment-753549857
          // output generation hooks: https://rollupjs.org/plugin-development/#output-generation-hooks
          hook: 'writeBundle',
        }),
        // for source control purposes
        // visualizer({
        //   template: 'list',
        //   filename: 'reports/bundle-report.yml',
        // }),
      ],
    },
  },
})
