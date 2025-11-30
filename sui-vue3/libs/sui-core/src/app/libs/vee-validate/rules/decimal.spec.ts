import { suiteName } from '@/../test/utils'
import decimal from './decimal'

describe(suiteName(__filename), () => {

  it('should consider a whole number value to be valid', () => {

    expect(decimal(100)).toEqual(true)

  })

  it('should consider a whole number string value to be valid', () => {

    expect(decimal('100')).toEqual(true)

  })

  it('should consider an undefined value to be valid', () => {

    expect(decimal(undefined)).toEqual(true)

  })

  it('should consider a null value to be valid', () => {

    expect(decimal(null)).toEqual(true)

  })

  it('should consider a floating number value to be valid', () => {

    expect(decimal(1.00)).toEqual(true)

  })

  it('should consider a floating number string value to be valid', () => {

    expect(decimal('1.00')).toEqual(true)

  })

  it('should consider a scientific notation number value to be valid', () => {

    expect(decimal(1.e3)).toEqual(true)

  })

  it('should consider a non-numeric number string value to be invalid', () => {

    expect(decimal('foo.bar')).toEqual(false)

  })

  it('should consider a "true" boolean value to be invalid', () => {

    expect(decimal(true)).toEqual(false)

  })

  it('should consider a "false" boolean value to be invalid', () => {

    expect(decimal(false)).toEqual(false)

  })

})
