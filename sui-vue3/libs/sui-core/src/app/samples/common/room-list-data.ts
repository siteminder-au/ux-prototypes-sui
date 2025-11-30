import { times } from 'lodash-es'

export interface RoomType {
  id: number
  name: string
  description: string
  imageUrl: string
  amenities: Amenity[]
}

export interface Amenity {
  id: number
  name: string
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const roomTypes = (): RoomType[] => {

  return times(10, (roomTypeIndex) => {
    return {
      id: roomTypeIndex,
      name: `Item ${roomTypeIndex + 1}`,
      description: times(getRandomNumber(3, 8), (descriptionIndex: number) => `Generated description ${descriptionIndex + 1}.`).join(' '),
      imageUrl: `https://picsum.photos/300/200?${roomTypeIndex}`,
      amenities: times(getRandomNumber(3, 8), (amenityIndex) => {
        return {
          id: amenityIndex,
          name: `Amenity ${amenityIndex + 1}`,
        }
      }),
    }
  })

}
