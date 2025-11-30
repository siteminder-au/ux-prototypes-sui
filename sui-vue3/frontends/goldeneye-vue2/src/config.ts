///////////////////////////////////////////////////
// DON'T MODIFY THIS FILE
// Add configs to the `.dotenv` file, items starting with `CONFIG_`
// Add any types to `/types/Config.d.ts`
//////////////////////////////////////////////////

type Config = {
  GTM_ID: string
  GTM_PREVIEW: string
  GTM_AUTH: string
  GTM_ENV: string

  LOGIN_URL: string
  LOGOUT_URL: string

  AUTHENTICATE_URL: string

  PLATFORM_ENTERPRISE_BEEF_API_URL: string
  PLATFORM_ENTERPRISE_BEEF_WS_URL: string

  NXS_ENTERPRISE_BEEF_API_URL: string
  NXS_ENTERPRISE_BEEF_WS_URL: string

  CM_ENTERPRISE_BEEF_API_URL: string
  CM_ENTERPRISE_BEEF_WS_URL: string

  LAUNCHDARKLY_CLIENT_ID: string

  FEATURES_ENABLED: string

  VUE_DEVTOOLS: boolean

  FLEXMONSTER_LICENSE_KEY: string

  KNOWLEDGE_BASE_URL: string
  PARTNER_KNOWLEDGE_BASE_URL: string
  PARTNER_HUB_URL: string
}

declare global {
    interface Window {
      __APPCONFIG__: Config
    }
}

const windowConfig: Config = window.__APPCONFIG__ ?? {}

// This represents some fallback default values for some of our config if they are not specified in the config repos
const configDefaults: Partial<Config> = {
  KNOWLEDGE_BASE_URL: 'https://learn.multi-property.siteminder.com/s',
  PARTNER_KNOWLEDGE_BASE_URL: 'https://partnerhub.siteminder.com/playbook/resources',
  PARTNER_HUB_URL: 'https://partnerhub.siteminder.com'
}

const windowConfigWithDefaults = {
  ...configDefaults,
  ...windowConfig
}
export default windowConfigWithDefaults
