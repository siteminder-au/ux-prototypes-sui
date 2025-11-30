import { format } from 'fecha'
import { createTimeRange } from './create-time-range'

describe('validateHHmmTime', () => {

  it('time range from hour steps', () => {

    const range = createTimeRange('00:00', '02:00', '01:00')
      .map(date => format(date, 'HH:mm'))

    expect(range).toEqual([
      '00:00',
      '01:00',
      '02:00',
    ])

  })

  it('time range with 30 minute steps', () => {

    const range = createTimeRange('00:00', '02:00', '00:30')
      .map(date => format(date, 'HH:mm'))

    expect(range).toEqual([
      '00:00',
      '00:30',
      '01:00',
      '01:30',
      '02:00',
    ])

  })

  it('time range with 5 minute steps', () => {

    const range = createTimeRange('00:00', '00:15', '00:05')
      .map(date => format(date, 'HH:mm'))

    expect(range).toEqual([
      '00:00',
      '00:05',
      '00:10',
      '00:15',
    ])

  })

  it('24 hour time range', () => {

    const range = createTimeRange('00:00', '23:00', '01:00')
      .map(date => format(date, 'HH:mm'))

    expect(range).toEqual(expect.arrayContaining([
      '00:00',
      '23:00',
    ]))

    expect(range).toHaveLength(24)

  })

  it('should handle invalid from', () => {
    expect(() => {
      createTimeRange('AA:BB', '02:00', '00:30')
    }).toThrowError('invalid from time=AA:BB')
  })

  it('should handle invalid to', () => {
    expect(() => {
      createTimeRange('01:00', '99:99', '00:30')
    }).toThrowError('invalid to time=99:99')
  })

  it('should handle invalid step', () => {
    expect(() => {
      createTimeRange('01:00', '11:00', '00:99')
    }).toThrowError('invalid step time=00:99')
  })

})
