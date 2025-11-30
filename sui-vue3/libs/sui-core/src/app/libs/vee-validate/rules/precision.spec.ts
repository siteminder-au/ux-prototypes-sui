import { suiteName } from '@/../test/utils'
import precision from './precision'

describe(suiteName(__filename), () => {

  it('should consider a floating value with a precision less than the required precision to be valid', () => {

    expect(precision(1.1, [2])).toBe(true)
    expect(precision('1.1', [2])).toBe(true)

  })

  it('should consider a floating value with a precision equal to the required precision to be valid', () => {

    expect(precision(1.10, [2])).toBe(true)
    expect(precision('1.10', [2])).toBe(true)

  })

  it('should consider a floating value with a precision greater than the required precision to be invalid', () => {

    expect(precision(1.121, [2])).toBe(false)
    expect(precision('1.121', [2])).toBe(false)

  })

  it('should consider a negative floating value with a precision less than the required precision to be valid', () => {

    expect(precision(-1.1, [2])).toBe(true)
    expect(precision('-1.1', [2])).toBe(true)

  })

  it('should consider a negative floating value with a precision equal to the required precision to be valid', () => {

    expect(precision(-1.10, [2])).toBe(true)
    expect(precision('-1.10', [2])).toBe(true)

  })

  it('should consider a negative floating value with a precision greater than the required precision to be invalid', () => {

    expect(precision(-1.121, [2])).toBe(false)
    expect(precision('-1.121', [2])).toBe(false)

  })

  it('should consider a whole number value to be valid', () => {

    expect(precision(100, [2])).toBe(true)
    expect(precision('100', [2])).toBe(true)

  })

  it('should consider a null value to be valid', () => {

    expect(precision(null, [2])).toBe(true)

  })

  it('should consider an undefined value to be valid', () => {

    expect(precision(undefined, [2])).toBe(true)

  })

  it('should consider an empty value to be valid', () => {

    expect(precision('', [2])).toBe(true)

  })

})
