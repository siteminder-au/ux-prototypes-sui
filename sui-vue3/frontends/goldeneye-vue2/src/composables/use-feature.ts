import { reactive } from 'vue'
import { fromPairs, map, split, pipe } from 'lodash/fp'
import get from 'lodash/get'
import pick from 'lodash/pick'
import config from '../config'

export type FeatureMap = typeof presetFeatures
export type FeatureName = keyof typeof presetFeatures
export interface UseFeature {
  presetFeatures: FeatureMap
  features: FeatureMap
  featureNames: string[]
}

export const presetFeatures = {
  'channel-blacklist': false,
  'cm-sync': false,
  'custom-pms-whitelist': false,
  'direct-bookings': false,
  'enterprise-platform': false,
  'health-check-pms-reservations-resend-mock-data': false,
  'insights-extended-range': false,
  'legacy-users': false,
  'tbb-group-rate-plans-drop-1': false,
  'white-label-redirect': false,
  'direct-booking-cancellation-policies-phase-3': false,
  'distribution-direct-booking-deals-and-dates-phase-2': false,
  'direct-booking-promo-codes-phase-4': false,
  'ux-refresh-sui-direct-booking': false,
  'team-spaces': false,
}

const envFeatures = pipe(
  split(','),
  map(name => name.trim()),
  map((name) => {
    if (name === 'insights-extended-range') {
      return ([name, 91])
    }
    return ([name, true])
  }),
  fromPairs,
)(get(config, 'FEATURES_ENABLED', ''))

export const featureNames = Object.keys(presetFeatures)

const defaultFeatures = {
  ...presetFeatures,
  ...pick(envFeatures, featureNames),
}

const features = reactive({
  ...defaultFeatures,
})

export const useFeature = (): UseFeature => ({
  presetFeatures,
  features,
  featureNames,
})
