export interface ReservationGuest {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface ReservationRoom {
  name: string
  adults: number
  children: number
}

export interface Reservations {
  bookingId: string
  guest: ReservationGuest
  status: string
  checkIn: string
  checkOut: string
  room: ReservationRoom
  price: number
  currency: string
  createdAt: string
  updatedAt?: string
}
