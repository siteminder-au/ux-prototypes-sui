/* eslint-disable no-param-reassign */
import type { GraphQLResolveInfo } from 'graphql'
import { rootLogger } from '../../shared'
import { Context } from '../schema/context'
import { getCamp } from '../../services/mock-api'

const logger = rootLogger.child({})

export const contextMiddleware = async (resolve: Function, obj: unknown, args: { id: string }, ctx: Context, info: GraphQLResolveInfo) => {

  const { id } = args
  const { traceToken } = ctx

  const campAlreadyInContext = ctx.camp && ctx.camp.id

  if (campAlreadyInContext) {
    return resolve(obj, args, ctx, info)
  }

  logger.info({ traceToken, id }, 'GraphQL context middleware')

  if (id) {
    await getCamp(id, traceToken)

    ctx.camp = {
      id,
    }
  }

  return resolve(obj, args, ctx, info)

}
