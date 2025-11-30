import { suiteName } from '@/../test/utils'
import {
  addMonths,
  getDateParts,
  getDateFromParts,
  getMonthNames,
  getNormalizedDate,
  isValidDate,
  normalizeMonthYearString,
  pad,
  setupPopper,
  MonthLabelFormatType,
} from './helpers'
import { SmCalendarPlacement, SmCalendarPosition } from '../sm-calendar.types'

const createPopperMock = jest.fn()

jest.mock('@popperjs/core', () => ({
  createPopperLite: (trigger: Element, content: HTMLElement, options: any) => createPopperMock(trigger, content, options),
  flip: { name: 'flip' },
  offset: { name: 'offset' },
}))

beforeEach(jest.clearAllMocks)

describe(suiteName(__filename), () => {

  describe('setupPopper', () => {
    it('should call createPopper based on the config - start placement', () => {
      const trigger = document.createElement('button')
      const content = document.createElement('div')

      setupPopper({
        fallbackPlacements: true,
        placement: SmCalendarPlacement.TOP_START,
        position: SmCalendarPosition.ABSOLUTE,
        offsetDistance: 4,
        trigger,
        content,
      })

      expect(createPopperMock).toHaveBeenCalledWith(
        trigger,
        content,
        {
          placement: SmCalendarPlacement.TOP_START,
          strategy: SmCalendarPosition.ABSOLUTE,
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: [SmCalendarPlacement.TOP_START, SmCalendarPlacement.BOTTOM_START],
              },
            },
            {
              name: 'offset',
              options: {
                offset: [0, 4],
              },
            },
          ],
        },
      )
    })

    it('should call createPopper based on the config - end placement', () => {
      const trigger = document.createElement('button')
      const content = document.createElement('div')

      setupPopper({
        fallbackPlacements: true,
        placement: SmCalendarPlacement.TOP_END,
        position: SmCalendarPosition.FIXED,
        trigger,
        content,
      })

      expect(createPopperMock).toHaveBeenCalledWith(
        trigger,
        content,
        {
          placement: SmCalendarPlacement.TOP_END,
          strategy: SmCalendarPosition.FIXED,
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: [SmCalendarPlacement.TOP_END, SmCalendarPlacement.BOTTOM_END],
              },
            },
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
        },
      )
    })

    it('should call createPopper without fallback placements', () => {
      const trigger = document.createElement('button')
      const content = document.createElement('div')

      setupPopper({
        fallbackPlacements: false,
        placement: SmCalendarPlacement.TOP_END,
        position: SmCalendarPosition.FIXED,
        trigger,
        content,
      })

      expect(createPopperMock).toHaveBeenCalledWith(
        trigger,
        content,
        {
          placement: SmCalendarPlacement.TOP_END,
          strategy: SmCalendarPosition.FIXED,
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: [],
              },
            },
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
        },
      )
    })

    it('should not call createPopper if there is no trigger nor content', () => {
      setupPopper({
        fallbackPlacements: false,
        placement: SmCalendarPlacement.TOP_END,
        position: SmCalendarPosition.FIXED,
        trigger: undefined,
        content: undefined,
      })

      expect(createPopperMock).not.toHaveBeenCalled()
    })
  })

  describe('pad', () => {
    it('should add leading characters to the value', () => {
      expect(pad(7)).toEqual('07')
      expect(pad(7, 3, '0')).toEqual('007')
      expect(pad(null)).toEqual('00')
    })

    it('should not add leading characters to the value if length has been reached', () => {
      expect(pad(999)).toEqual('999')
    })
  })

  describe('addMonths', () => {
    it('should add months to the date', () => {
      const inputDate = new Date(2022, 1, 1)

      expect(addMonths(inputDate, 3)).toEqual(new Date(2022, 4, 1))
    })

    it('should subtract months to the date', () => {
      const inputDate = new Date(2022, 5, 1)

      expect(addMonths(inputDate, -3)).toEqual(new Date(2022, 2, 1))
    })
  })

  describe('normalizeMonthYearString', () => {
    it('should normalize a date string', () => {
      expect(normalizeMonthYearString('11-2019')).toEqual('2019-11')
      expect(normalizeMonthYearString('3-2019')).toEqual('2019-03')
      expect(normalizeMonthYearString('2019-1')).toEqual('2019-01')
    })

    it('should return original value if it doesn\'t need to be normalized', () => {
      expect(normalizeMonthYearString('jan 2000')).toEqual('jan 2000')
      expect(normalizeMonthYearString('2018-11')).toEqual('2018-11')
      expect(normalizeMonthYearString('2018')).toEqual('2018')
    })

    it('should not normalize an invalid value', () => {
      expect(normalizeMonthYearString('')).toEqual(undefined)
    })
  })

  describe('getNormalizedDate', () => {
    it('should normalize the date instance', () => {
      const dateWithHours = new Date(2000, 10, 20, 4, 30, 12)

      expect(getNormalizedDate(dateWithHours).getHours()).toEqual(0)
      expect(getNormalizedDate(dateWithHours).getMinutes()).toEqual(0)
      expect(getNormalizedDate(dateWithHours).getSeconds()).toEqual(0)
    })

    it('should normalize the date string', () => {
      const dateString = '2000-11-19'

      expect(getNormalizedDate(dateString).getHours()).toEqual(0)
      expect(getNormalizedDate(dateString).getMinutes()).toEqual(0)
      expect(getNormalizedDate(dateString).getSeconds()).toEqual(0)
    })
  })

  describe('getDateParts', () => {
    it('should convert valid date to date parts object', () => {
      expect(getDateParts(new Date(1999, 10, 11))).toEqual({ month: 11, year: 1999 })
      expect(getDateParts('1999-11')).toEqual({ month: 11, year: 1999 })
    })
  })

  describe('getDateFromParts', () => {
    it('should convert date parts object to date', () => {
      expect(getDateFromParts({ month: 11, year: 1999 })).toEqual(new Date(1999, 10))
    })
  })

  describe('isValidDate', () => {
    it('should validate date inputs', () => {
      expect(isValidDate(null)).toEqual(false)
      expect(isValidDate(undefined)).toEqual(false)
      expect(isValidDate('')).toEqual(false)
      expect(isValidDate('2018-10-31')).toEqual(true)
      expect(isValidDate(new Date(2000, 10, 20))).toEqual(true)
    })
  })

  describe('getMonthNames', () => {
    const getMockedDateTimeFormat = (length: any) => {
      // Use specific locale when running the test suite
      return new Intl.DateTimeFormat('en-US', {
        month: length,
      })
    }

    beforeEach(() => {
      jest.spyOn(Intl, 'DateTimeFormat')
        .mockImplementationOnce((_, options: any) => getMockedDateTimeFormat(options.month))
    })

    it('should return month names - short', () => {
      const months = getMonthNames(MonthLabelFormatType.SHORT)

      expect(months.length).toBe(12)
      expect(months[0]).toBe('Jan')
      expect(months[11]).toBe('Dec')
    })

    it('should return month names - long', () => {
      const months = getMonthNames(MonthLabelFormatType.LONG)

      expect(months.length).toBe(12)
      expect(months[0]).toBe('January')
      expect(months[11]).toBe('December')
    })

  })

})
