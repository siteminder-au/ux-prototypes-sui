import { Reservations } from '@/views/reservations.types'

const supportedStatus = ['Booked', 'Modified', 'Cancelled']

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const padNumber = (number: number): string => {
  return number.toString().padStart(10, '0')
}

/**
 * Generate and return fake reservations
 * @returns {Reservations[]} Array of reservations
 */
export const getReservations = (): Reservations[] => {
  const totalItems = 100

  return Array.from({ length: totalItems }, (_, index) => {
    const id = index + 1

    return {
      bookingId: padNumber(id),
      guest: {
        firstName: `${alphabet[(id + 6) % alphabet.length]}****`, // Cycle through the alphabet
        lastName: `${alphabet[(id - 1) % alphabet.length]}******`, // Cycle through the alphabet
        email: `email-${id}@test.com`,
        phone: `+1 123 456 789${id}`,
      },
      status: supportedStatus[id % supportedStatus.length], // Cycle through the statuses
      checkIn: '2023-09-01',
      checkOut: '2023-09-21',
      room: {
        name: 'Deluxe tent',
        adults: 1,
        children: 0,
      },
      price: 100,
      currency: 'USD',
      createdAt: '2023-07-04',
      updatedAt: undefined,
    }
  })
}
