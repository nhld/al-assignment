import { BaseSupplier } from './base'
import { IHotel } from '../interfaces/interfaces'
import { PaperfliesHotelData, PaperfliesImage } from '../interfaces/paperflies'

const PAPERFLIES_API_URL = 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies'

export class Paperflies extends BaseSupplier {
  endpoint = (): string => PAPERFLIES_API_URL

  private cleanBookingConditions = (strings: string[]): string[] => {
    return strings.map((str) =>
      str
        .split('===')
        .filter((part) => part.trim().length > 0)
        .map((part) => part.trim())
        .join(' ')
    )
  }

  parse = (data: PaperfliesHotelData): IHotel => {
    const { hotel_id, destination_id, hotel_name, location, details, amenities, images, booking_conditions } = data

    return {
      id: hotel_id || '',
      destination_id: String(destination_id || ''),
      name: hotel_name || '',
      location: {
        address: location.address || '',
        country: location.country || '',
        lat: location.lat,
        lng: location.lng,
        city: location.city
      },
      description: details || '',
      amenities: {
        general: amenities.general,
        room: amenities.room
      },
      images: {
        rooms: images.rooms.map((image: PaperfliesImage) => ({
          link: image.link || '',
          description: image.caption || ''
        })),
        site: images.site.map((image: PaperfliesImage) => ({
          link: image.link || '',
          description: image.caption || ''
        })),
        amenities: []
      },
      booking_conditions: this.cleanBookingConditions(booking_conditions) || []
    }
  }
}
