import { SmCalendarDateParts } from '@siteminder/sui-core/components/forms/sm-calendar'

export interface Campsite {
  id: number
  name: string
  description?: string
  accommodations: string[]
  smokingPolicy: 'non-smoking' | 'smoking'
  allowPets: boolean
  applicableStartDate?: SmCalendarDateParts | null
  advertisedDateRange?: SmCalendarDateParts | null
  maximumAdvanceBookingDays: boolean
  dynamicDiscounts: boolean
  restrictToMobile: boolean
  thumbnailImageSrc?: string
}
