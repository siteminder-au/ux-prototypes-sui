import errcode from 'err-code'

export const getCamp = async (id: string, traceToken: string) => {

  const foundCamp = camps.find(({ id: campId }) => campId === id)

  if (!foundCamp) {
    throw errcode(
      new Error(`Camp not found for id: ${id}`),
      'CampNotFoundError',
      { traceToken, id },
    )
  }

  return foundCamp

}

const camps = [
  {
    id: '12345',
    name: 'hilton',
    campsites: [
      {
        id: '1',
        name: 'Whispering Pines Campground',
        description: 'Nestled deep within the embrace of a lush, evergreen forest, Whispering Pines Campground offers an enchanting escape into the heart of nature.',
        accommodations: ['small-tent', 'van-pickup'],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
        thumbnailImageSrc: 'image1.png',
      },
      {
        id: '2',
        name: 'Serenity Haven Campsite',
        description: 'Serenity Haven Campsite is a tranquil oasis, nestled in the heart of a lush, evergreen forest. The campsite is a short walk from the beach, and is the perfect place to relax and unwind.',
        accommodations: [],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
        thumbnailImageSrc: 'image2.png',
      },
      {
        id: '3',
        name: 'Wildflower Meadow Camp',
        description: 'Nestled in nature\'s embrace, Wildflower Meadow Camp beckons with vibrant wildflowers painting the landscape. Choose from rustic cabins, tent sites, or glamping options, each providing a unique retreat. Communal kitchens foster camaraderie, and well-maintained restrooms ensure comfort. The central gathering area, with a crackling fire pit, invites storytelling under the starlit sky. A cozy indoor space offers respite, stocked with games and books. Embracing sustainability, the camp minimizes environmental impact with recycling stations and eco-friendly practices. Experience the perfect blend of nature and comfort at Wildflower Meadow Camp.',
        accommodations: [],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
        thumbnailImageSrc: 'image3.png',
      },
      {
        id: '4',
        name: 'River\'s Edge Retreat',
        accommodations: [],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
        thumbnailImageSrc: 'image1.png',
      },
      {
        id: '5',
        name: 'Lakeside Tranquility Camp',
        accommodations: [],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
        thumbnailImageSrc: 'image2.png',
      },
      {
        id: '6',
        name: 'Sunset Cove Campsite',
        accommodations: [],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
        thumbnailImageSrc: 'image3.png',
      },
      {
        id: '7',
        name: 'Cedarwood Campground',
        accommodations: [],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
      },
      {
        id: '8',
        name: 'Hidden Valley Campground',
        accommodations: [],
        maximumAdvanceBookingDays: false,
        dynamicDiscounts: true,
        restrictToMobile: false,
        smokingPolicy: 'non-smoking',
        allowPets: true,
      },
    ],
    accommodations: [
      {
        label: 'Small Tent',
        code: 'small-tent',
      },
      {
        label: 'Medium Tent',
        code: 'medium-tent',
      },
      {
        label: 'Large Tent',
        code: 'large-tent',
      },
      {
        label: 'Backpacker Tent',
        code: 'backpacker-tent',
      },
      {
        label: 'Van/Pickup',
        code: 'van-pickup',
      },
      {
        label: 'Trailer Tent',
        code: 'trailer-tent',
      },
    ],
  },
]
