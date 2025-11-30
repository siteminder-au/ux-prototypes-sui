export interface Options {
  precision?: number
  allowExponential?: boolean
}

const decimalValidator = (value: any): boolean => {

  if (value === null || value === undefined || value === '') {
    return true
  }

  return !Number.isNaN(value - Number.parseFloat(value))

}
export default decimalValidator
