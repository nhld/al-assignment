import { IHotel, ILocation, IAmenities, IImages } from './interfaces/interfaces'

class StringHelper {
  static normalizeString(str: string): string {
    // return str.toLowerCase().replace(/\s+/g, '')
    return str
  }
}

class MergeStrategy {
  static getLongerString(values: string[]): string {
    return values.reduce(
      (longest, current) => ((current?.length || 0) > (longest?.length || 0) ? current : longest),
      ''
    )
  }

  static mergeArrays<T>(arrays: T[][]): T[] {
    return [...new Set(arrays.flat())]
  }

  static normalizeAndDeduplicateArray(arr: string[]): string[] {
    const normalizedSet = new Set(
      arr.map((item) => StringHelper.normalizeString(item)).filter((item) => item.length > 0)
    )
    return Array.from(normalizedSet)
  }

  static getLongerArray<T>(arrays: T[][]): T[] {
    return arrays.reduce(
      (longest, current) => ((current?.length || 0) > (longest?.length || 0) ? current : longest),
      []
    )
  }

  static mergeImages(images: IImages[]): IImages {
    return {
      rooms: MergeStrategy.mergeArrays(images.map((img) => img.rooms || [])),
      site: MergeStrategy.mergeArrays(images.map((img) => img.site || [])),
      amenities: MergeStrategy.mergeArrays(images.map((img) => img.amenities || []))
    }
  }

  // static mergeAmenities(amenities: IAmenities[]): IAmenities {
  //   return {
  //     general: MergeStrategy.getLongerArray(amenities.map((a) => a.general || [])),
  //     room: MergeStrategy.getLongerArray(amenities.map((a) => a.room || []))
  //   }
  // }
  static mergeAmenities(amenities: IAmenities[]): IAmenities {
    // Get the longer arrays first, then normalize and deduplicate
    const longerGeneralArray = MergeStrategy.getLongerArray(amenities.map((a) => a.general || []))
    const longerRoomArray = MergeStrategy.getLongerArray(amenities.map((a) => a.room || []))

    return {
      general: MergeStrategy.normalizeAndDeduplicateArray(longerGeneralArray),
      room: MergeStrategy.normalizeAndDeduplicateArray(longerRoomArray)
    }
  }

  static mergeLocation(locations: ILocation[]): ILocation {
    const validLocations = locations.filter((loc) => loc !== null && loc !== undefined)
    if (validLocations.length === 0) return {} as ILocation

    const countries = validLocations
      .map((loc) => loc.country)
      .filter((country) => country !== null && country !== undefined && country.trim() !== '')

    return {
      lat: Helper.getFirstNotNone(validLocations, 'lat'),
      lng: Helper.getFirstNotNone(validLocations, 'lng'),
      address: Helper.getFirstNotNone(validLocations, 'address') || '',
      city: Helper.getFirstNotNone(validLocations, 'city') || '',
      country: MergeStrategy.getLongerString(countries) || ''
    }
  }
}

class Helper {
  static getFirstNotNone(hotels: any[], fields: string): any {
    const fieldPath = fields.split('.')

    for (const hotel of hotels) {
      let value: any = hotel
      for (const field of fieldPath) {
        value = value?.[field]
        if (value === undefined || value === null) break
      }
      if (value !== undefined && value !== null && (typeof value !== 'object' || Object.keys(value).length > 0)) {
        return value
      }
    }
    return null
  }
}

export class HotelsService {
  private data: IHotel[] = []

  mergeAndSave = (hotels: IHotel[]): void => {
    const map = new Map<string, IHotel[]>()

    for (const hotel of hotels) {
      const key = `${hotel.id}|${hotel.destination_id}`
      const existing = map.get(key) || []
      map.set(key, [...existing, hotel])
    }

    for (const groupedHotels of map.values()) {
      if (groupedHotels.length === 1) {
        // this.data.push(groupedHotels[0])
        const hotel = groupedHotels[0]
        hotel.amenities = MergeStrategy.mergeAmenities([hotel.amenities])
        this.data.push(hotel)
      } else {
        const mergedHotel: IHotel = {
          id: Helper.getFirstNotNone(groupedHotels, 'id') || '',
          destination_id: Helper.getFirstNotNone(groupedHotels, 'destination_id') || '',
          name: MergeStrategy.getLongerString(groupedHotels.map((hotel) => hotel.name)),
          location: MergeStrategy.mergeLocation(groupedHotels.map((hotel) => hotel.location)),
          description: MergeStrategy.getLongerString(groupedHotels.map((hotel) => hotel.description)),
          amenities: MergeStrategy.mergeAmenities(groupedHotels.map((hotel) => hotel.amenities)),
          images: MergeStrategy.mergeImages(groupedHotels.map((hotel) => hotel.images)),
          booking_conditions: MergeStrategy.mergeArrays(groupedHotels.map((hotel) => hotel.booking_conditions || []))
        }

        this.data.push(mergedHotel)
      }
    }
  }

  find = (hotelIds: string[], destinationIds: string[]): IHotel[] => {
    if (hotelIds.includes('none') || destinationIds.includes('none')) {
      return this.data
    }

    if (hotelIds.length === 1 && destinationIds.length === 1) {
      return this.data
    }

    return this.data.filter(
      (hotel) =>
        (hotelIds.length === 0 || hotelIds.includes(hotel.id)) &&
        (destinationIds.length === 0 || destinationIds.includes(hotel.destination_id))
    )
  }
}
