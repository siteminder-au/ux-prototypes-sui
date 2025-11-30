export interface Options {
  precision?: number
}

const precisionValidator = (value: any, [limit]: number[]): boolean => {

  if (value === null || value === undefined || value === '') {
    return true
  }

  const significantNumbers = Number(value).toPrecision().split('.')[1]?.length

  if (typeof significantNumbers === 'undefined') {
    return true // The value is a whole number
  }

  return significantNumbers <= Number(limit)

}

export default precisionValidator
