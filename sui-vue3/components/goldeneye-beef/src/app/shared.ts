import { createLogger } from '@siteminder/logging'
import { createConfig } from '@siteminder/config'
import { createMetrics } from '@siteminder/metrics'

export const config = createConfig({
  SYSTEM_NAME: {
    env: 'SYSTEM_NAME',
    format: '*',
    default: 'sui',
  },
  COMPONENT_NAME: {
    env: 'COMPONENT_NAME',
    format: '*',
    default: 'goldeneye-beef',
  },
  HTTP_PORT: {
    env: 'HTTP_PORT',
    format: 'port',
    default: 3000,
  },
  METRICS_PORT: {
    env: 'METRICS_PORT',
    format: 'port',
    default: 3001,
  },
  LOG_LEVEL: {
    env: 'LOG_LEVEL',
    format: '*',
    default: 'info',
  },
  FRONTEND_ORIGINS: {
    env: 'FRONTEND_ORIGINS',
    format: Array,
    default: null,
  },
  BODY_LIMIT_SIZE: {
    env: 'BODY_LIMIT_SIZE',
    format: String,
    default: '100kb',
  },
})

export const rootLogger = createLogger({
  name: `${config('SYSTEM_NAME')}/${config('COMPONENT_NAME')}`,
  level: config('LOG_LEVEL'),
})

export const metrics = createMetrics()
