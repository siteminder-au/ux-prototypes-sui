// Use this custom types file to be able to
// import certain modules in your vue/ts files
declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

declare module '*.svg' {
  const content: string
  export default content
}

// these modules are referenced in frontends/goldeneye/src/views/settings.vue
// we do this to remove the red squiggly line from vsc
declare module '@siteminder/sui-core/white-labelling/white-labelling.css'
declare module '@siteminder/sui-themes/sui-theme.esm.css'
declare module '@/assets/styles/little-hotelier.css'
declare module '@/assets/styles/multi-property.css'
declare module '@/assets/styles/platform-pay.css'
