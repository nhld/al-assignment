import { BaseSupplier } from './base'
import { IHotel } from '../interfaces/interfaces'
import { AcmeHotelData } from '../interfaces/acme'
import { DataCleaningHelper } from '../dataCleaningHelper'

const ACME_API_URL = 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme'

export class Acme extends BaseSupplier {
  endpoint = (): string => ACME_API_URL

  parse = (data: AcmeHotelData): IHotel => {
    const {
      Id,
      DestinationId,
      Name,
      Latitude,
      Longitude,
      Address,
      City,
      Country,
      Description,
      Facilities,
      Room,
      Rooms,
      Site,
      BookingConditions
    } = data

    return {
      id: Id || '',
      destination_id: String(DestinationId || ''),
      name: Name || '',
      location: {
        lat: Latitude,
        lng: Longitude,
        address: Address.trim() || '',
        city: City || '',
        country: Country || ''
      },
      description: Description.trim() || '',
      amenities: {
        general: DataCleaningHelper.normalizeCamelCaseStrings(Facilities) || [],
        room: Room || []
      },
      images: {
        rooms: Rooms || [],
        site: Site || [],
        amenities: []
      },
      booking_conditions: BookingConditions || []
    }
  }
}
