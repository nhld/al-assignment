export interface PatagoniaImage {
  url: string
  description: string
}

export interface PatagoniaImages {
  rooms: PatagoniaImage[]
  amenities: PatagoniaImage[]
}

export interface PatagoniaHotelData {
  id: string
  destination: string
  name: string
  lat: number
  lng: number
  address: string
  city: string
  country: string
  info: string
  amenities: string[]
  images: PatagoniaImages
}
