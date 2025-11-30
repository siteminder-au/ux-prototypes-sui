import { differenceInTimeString } from './relative-time'

describe('relative-time', () => {
  it('returns the correct strings given the time difference', () => {
    expect(differenceInTimeString(1)).toEqual('A few minutes ago')
    expect(differenceInTimeString(16 * 1000 * 60)).toEqual('About half an hour ago')
    expect(differenceInTimeString(46 * 1000 * 60)).toEqual('About an hour ago')
    expect(differenceInTimeString(91 * 1000 * 60)).toEqual('1 hour ago')
    expect(differenceInTimeString(190 * 1000 * 60)).toEqual('3 hours ago')
    expect(differenceInTimeString(1000 * 60 * 60 * 24)).toEqual('Yesterday')
    expect(differenceInTimeString(3 * 1000 * 60 * 60 * 24)).toEqual('3 days ago')
    expect(differenceInTimeString(10 * 1000 * 60 * 60 * 24)).toEqual('Last week')
    expect(differenceInTimeString(1000 * 60 * 60 * 24 * 365)).toEqual('On 1 January')
  })
})
