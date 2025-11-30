// Use this custom types file to be able to
// import certain modules in your vue/ts files
// declare module '*.vue' {
//   import Vue from 'vue'

//   export default Vue
// }

declare module '*.svg' {
  const content: string
  export default content
}

// this is needed otherwise we get the following compile error:
// Cannot find module '@/views/sites-and-rates/campsites.vue' or its corresponding type declarations
// this occurs when we try importing `.vue` files in `.ts` files.
// This may be fixed if we generate *.vue.d.ts files for each *.vue file
declare module '*.vue'

// Step 4 in https://v3-migration.vuejs.org/migration-build.html#upgrade-workflow
declare module 'vue' {
  import { CompatVue } from 'vue'

  const Vue: CompatVue
  export default Vue
  export * from '@vue/runtime-dom'
  const { configureCompat } = Vue
  export { configureCompat }
}

// these modules are referenced in frontends/goldeneye/src/views/settings.vue
// we do this to remove the red squiggly line from vsc
declare module '@siteminder/sui-themes/sui-theme.esm.css'
declare module '@/assets/styles/campminder.css'
declare module '@/assets/styles/little-hotelier.css'
declare module '@/assets/styles/multi-property.css'
declare module '@/assets/styles/platform-pay.css'
