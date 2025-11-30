import { translate } from '@/services/i18n/currency'

const originalIntl = Intl
const mockOf = jest.fn()
const mockIsNil = jest.fn()

jest.mock('lodash', () => ({
  isNil: (...args: any) => mockIsNil(args),
}))

describe('currency', () => {
  beforeEach(() => {
    global.Intl = {
      DisplayNames: () => ({
        of: (...args: any) => mockOf(args),
      }),
    } as any
    mockOf.mockReturnValue('Australian Dollars')
  })

  afterEach(() => {
    global.Intl = originalIntl
  })

  describe('@translate', () => {
    describe('when isoCode is valid', () => {
      it('translates isoCode to appropriate display name', () => {
        const currency = {
          isoCode: 'AUD',
        }
        const displayName = translate(currency)
        expect(displayName).toBe('Australian Dollars')
        expect(mockOf).toHaveBeenCalledWith([currency.isoCode])
      })
    })

    describe('when isoCode is invalid', () => {
      beforeEach(() => {
        mockOf.mockImplementation(() => {
          throw new Error()
        })
      })

      it('falls back to name if name is supplied', () => {
        const currency = {
          isoCode: 'TEST',
          name: 'Test Currency',
        }

        mockIsNil.mockReturnValue(false)
        const displayName = translate(currency)

        expect(displayName).toBe('Test Currency')
        expect(mockOf).toHaveBeenCalledWith([currency.isoCode])
        expect(mockOf).toThrowError()
      })

      it('throws error name is nullish', () => {
        const currency = {
          isoCode: 'TEST',
        }

        mockIsNil.mockReturnValue(true)
        expect(() => {
          translate(currency)
        }).toThrowError()

        expect(mockOf).toHaveBeenCalledWith([currency.isoCode])
        expect(mockOf).toThrowError()
      })
    })
  })
})
