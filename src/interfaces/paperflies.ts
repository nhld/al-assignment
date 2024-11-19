import { ILocation, IAmenities } from './interfaces'

export interface PaperfliesImage {
  link: string
  caption: string
}

export interface PaperfliesImages {
  rooms: PaperfliesImage[]
  amenities: PaperfliesImage[]
  site: PaperfliesImage[]
}

export interface PaperfliesHotelData {
  hotel_id: string
  destination_id: string | number
  hotel_name: string
  location: ILocation
  details: string
  amenities: IAmenities
  images: PaperfliesImages
  booking_conditions: string[]
}
