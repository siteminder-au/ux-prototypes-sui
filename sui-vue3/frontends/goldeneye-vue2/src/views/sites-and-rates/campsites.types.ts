export interface Campsite {
  id: number
  name: string
  description?: string
  accommodations: string[]
  smokingPolicy: 'non-smoking' | 'smoking'
  allowPets: boolean
  applicableStartDate?: Date | null
  advertisedDateRange?: { start: Date | null, end: Date | null}
  maximumAdvanceBookingDays: boolean
  dynamicDiscounts: boolean
  restrictToMobile: boolean
  thumbnailImageSrc?: string
}
