import { BaseSupplier } from './base'
import { IHotel } from '../interfaces/interfaces'
import { PatagoniaHotelData, PatagoniaImage } from '../interfaces/patagonia'

const PATAGONIA_API_URL = 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia'

export class Patagonia extends BaseSupplier {
  endpoint = (): string => PATAGONIA_API_URL

  private cleanAmenities = (amenities: string[] | null | undefined): string[] => {
    if (!amenities) return []
    return amenities.map((amenity) => amenity?.toLowerCase() || '')
  }

  parse = (data: PatagoniaHotelData): IHotel => {
    const { id, destination, name, lat, lng, address, city, country, info, amenities, images } = data

    return {
      id: id || '',
      destination_id: String(destination || ''),
      name: name || '',
      location: {
        lat: lat,
        lng: lng,
        address: address || '',
        city: city || '',
        country: country || ''
      },
      description: info || '',
      amenities: {
        general: this.cleanAmenities(amenities) || [],
        room: []
      },
      images: {
        rooms: images.rooms.map((image: PatagoniaImage) => ({
          link: image.url || '',
          description: image.description || ''
        })),
        site: [],
        amenities: images.amenities.map((image: PatagoniaImage) => ({
          link: image.url || '',
          description: image.description || ''
        }))
      },
      booking_conditions: []
    }
  }
}
