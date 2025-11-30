import * as http from 'http'
import { Express } from 'express'
import { config, rootLogger } from './shared'
import { setupMainApp, setupMetricsApp } from './server'

const logger = rootLogger.child({})

const listen = (app: Express | http.Server, name: string, port: number) => {
  return app.listen(port, () => {
    logger.info(`Express ${name} server running at http://0.0.0.0:${port}/`)
  })
}

Promise.all([
  setupMainApp(),
  setupMetricsApp(),
])
  .then(([mainApp, metricsApp]) => {

    const mainServer = listen(mainApp.expressApp, 'main', config('HTTP_PORT'))
    const metricsServer = listen(metricsApp, 'metrics', config('METRICS_PORT'))

    process.on('SIGTERM', () => {

      mainServer.close(() => {
        logger.info('mainApp stopped by sigterm')
      })

      metricsServer.close(() => {
        logger.info('metricsApp stopped by sigterm')
      })

    })

  })
  .catch((err) => {
    console.log(err) // eslint-disable-line
    process.exit(1)
  })
