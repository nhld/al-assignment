export interface ILocation {
  address: string
  city: string
  country: string
  lat: number
  lng: number
}

export interface IAmenities {
  general: string[]
  room: string[]
}

export interface IImage {
  link: string
  description: string
}

export interface IImages {
  rooms: IImage[]
  site: IImage[]
  amenities: IImage[]
}

export interface IHotel {
  id: string
  destination_id: string
  name: string
  location: ILocation
  description: string
  booking_conditions: string[]
  amenities: IAmenities
  images: IImages
}
