import { parse } from 'fecha'

export const createTimeRange = (from: string, to: string, step: string): Date[] => {

  const parsedFrom = parse(from, 'HH:mm')
  const parsedTo = parse(to, 'HH:mm')
  const parsedStep = parse(step, 'HH:mm')

  if (parsedFrom === null) {
    throw new Error(`invalid from time=${from}`)
  }

  if (parsedTo === null) {
    throw new Error(`invalid to time=${to}`)
  }

  if (parsedStep === null) {
    throw new Error(`invalid step time=${step}`)
  }

  const range = []

  const currentTime = parsedFrom
  while (currentTime.getTime() <= parsedTo.getTime()) {

    range.push(new Date(currentTime))

    currentTime.setHours(currentTime.getHours() + parsedStep.getHours())
    currentTime.setMinutes(currentTime.getMinutes() + parsedStep.getMinutes())

  }

  return range

}
