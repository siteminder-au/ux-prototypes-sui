import { gql } from '@apollo/client/core'

export const getCampQuery = gql`
  query getCamp($id: ID!) {
    camp(id: $id) {
      name
      campsites {
        id
        name
        description
        accommodations
        maximumAdvanceBookingDays
        dynamicDiscounts
        restrictToMobile
        smokingPolicy
        allowPets
        thumbnailImageSrc
      }
      accommodations {
        code
        label
      }
    }
  }
`
