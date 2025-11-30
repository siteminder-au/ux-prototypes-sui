import { GraphQLError, GraphQLErrorExtensions } from 'graphql'
import { Express } from 'express'
import path from 'path'
import * as _ from 'lodash'
import { v4 as uuid } from 'uuid'
import * as beefBootstrap from '@siteminder/beef-bootstrap'
import { config, rootLogger, metrics } from './shared'
import { resolvers } from './graphql/resolvers'
import { contextMiddleware } from './graphql/middlewares/context'

const logger = rootLogger.child({})

type Server = {
  expressApp: Express
}

export const setupMainApp = async () => {

  const mainApp = await beefBootstrap.setupMainApp({
    system: config('SYSTEM_NAME'),
    component: config('COMPONENT_NAME'),
    metricsRegistry: metrics.registry,
    logger: rootLogger,
    swaggerPath: path.join(__dirname, 'swagger.yaml'),
    jwt: 'disabled',
    maximumRequestBodySize: config('BODY_LIMIT_SIZE'),
    cors: {
      origin: config('FRONTEND_ORIGINS'),
    },
    parseCookies: true,
    graphql: {
      schemaPath: path.join(__dirname, 'graphql', 'schema'),
      resolvers,
      context: async ({ raw: req }) => {
        const { traceToken } = req as any || uuid()

        const context = {
          traceToken,
        }

        return context
      },
      middlewares: [
        contextMiddleware,
      ],
      didEncounterError: (error, requestContext) => {
        const { operationName, contextValue: context } = requestContext
        const { traceToken } = context

        const err = error as GraphQLError

        if (!_.get(err, 'extensions.traceToken')) {
          (err.extensions as GraphQLErrorExtensions) = {
            traceToken,
            ...err.extensions,
          }
        }

        logger.error({ err, traceToken, operationName }, 'error serving request')
      },
    },
  })

  return {
    expressApp: mainApp.express,
  } as Server

}

export const setupMetricsApp = async () => {
  return beefBootstrap.setupMetricsApp({ registry: metrics.registry })
}
