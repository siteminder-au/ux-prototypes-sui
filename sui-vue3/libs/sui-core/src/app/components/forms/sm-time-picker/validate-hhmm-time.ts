import { parse } from 'fecha'

export const validateHHmmTime = (time: string): boolean => {

  return !!parse(time, 'HH:mm')

}
