// Specific to the ReservationsListFilters component since
// date range object can be of different types
export interface ReservationsListFiltersDateRange {
  start: Date | null
  end: Date | null
}

export interface ReservationsListFiltersParams {
  bookingId?: string | null
  guestLastName?: string | null
  dateRange?: ReservationsListFiltersDateRange | null
  dateTime?: Date | null
  time?: string | null
}
