/**
 * Checks if the Storybook url contains `isPercy` query params
 * This will be used in additional story setups we need to do before taking a screenshot, e.g opening popovers.
 * This query param is configured in frontends/docs/.storybook/preview.js
 */
export const isPercyContext = (): string | null => {
  return new URLSearchParams(document.location.search).get('isPercy')
}
