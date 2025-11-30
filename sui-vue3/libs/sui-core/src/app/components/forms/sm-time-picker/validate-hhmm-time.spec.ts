import { validateHHmmTime } from './validate-hhmm-time'

describe('validateHHmmTime', () => {

  it('should handle time on the hour', () => {

    expect(validateHHmmTime('10:00')).toBe(true)

  })

  it('should handle time on the minute', () => {

    expect(validateHHmmTime('10:30')).toBe(true)

  })

  it('should handle midnight 00:00', () => {

    expect(validateHHmmTime('00:00')).toBe(true)

  })

  it('should not handle midnight 24:00', () => {

    expect(validateHHmmTime('24:00')).toBe(false)

  })

  it('should throw missing separator', () => {

    expect(validateHHmmTime('1000')).toBe(false)

  })

  it('should throw non numeric', () => {

    expect(validateHHmmTime('a1000')).toBe(false)

  })

})
