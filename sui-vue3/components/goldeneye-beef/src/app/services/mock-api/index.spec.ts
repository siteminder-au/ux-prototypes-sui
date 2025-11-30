import { chance, suiteName } from '../../../../test/utils'
import { getCamp } from './index'

describe(suiteName(__filename), () => {

  const id = 'invalid-id'
  const traceToken = chance.guid()

  it('should throw CampNotFoundError if camp is not found', async () => {

    await expect(getCamp(id, traceToken)).rejects.toMatchObject({
      code: 'CampNotFoundError',
      id,
      traceToken,
    })

  })

})
