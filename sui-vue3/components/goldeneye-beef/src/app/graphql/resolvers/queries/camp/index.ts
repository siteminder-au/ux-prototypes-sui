import { UserInputError } from '@siteminder/beef-bootstrap/types'
import { rootLogger } from '../../../../shared'
import { GqlCamp, GqlResolvers } from '../../../schema'
import { Context } from '../../../schema/context'
import { getCamp } from '../../../../services/mock-api'

const logger = rootLogger.child({})

export const camp: GqlResolvers['Query']['camp'] = async (obj, args, context: Context) => {

  const { traceToken } = context
  const { id } = args

  logger.info({ traceToken, id }, 'GraphQL Query Camp')

  try {
    const _camp = await getCamp(id, traceToken)

    return _camp as GqlCamp
  } catch (err: any) {
    if (err.code === 'CampNotFoundError') {
      throw new UserInputError('camp-not-found', { traceToken, id })
    }

    throw err
  }

}
