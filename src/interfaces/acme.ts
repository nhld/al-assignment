import { IImage } from './interfaces'

export interface AcmeHotelData {
  Id: string
  DestinationId: string
  Name: string
  Latitude: number
  Longitude: number
  Address: string
  City: string
  Country: string
  Description: string
  Facilities: string[]
  Room: string[]
  Rooms: IImage[]
  Site: IImage[]
  Amenities: string[]
  BookingConditions: string[]
}
