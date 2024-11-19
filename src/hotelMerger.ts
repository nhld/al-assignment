import { IHotel, ILocation, IAmenities, IImages, IImage } from './interfaces/interfaces'
class HotelMerger {
  static getLongestString(strings: string[]): string {
    let longestString = ''
    for (const str of strings) {
      if ((str?.length || 0) > longestString.length) {
        longestString = str
      }
    }
    return longestString
  }

  static mergeArrays<T>(arrays: T[][]): T[] {
    return [...new Set(arrays.flat())]
  }

  static deduplicateArray(arr: string[]): string[] {
    const unique = new Set(arr.filter((item) => item.length > 0))
    return Array.from(unique)
  }

  static getLongestArray(arrays: string[][]): string[] {
    let longest: string[] = []
    for (const arr of arrays) {
      if (!arr) continue
      if (arr.length > longest.length) {
        longest = arr
      }
    }
    return longest
  }

  static mergeImages(images: IImages[]): IImages {
    const deduplicateImagesByUrl = (imageArray: IImage[]) => {
      const uniqueUrls = new Set<string>()
      return imageArray.filter((img) => {
        if (!img.link || uniqueUrls.has(img.link)) {
          return false
        }
        uniqueUrls.add(img.link)
        return true
      })
    }

    return {
      rooms: deduplicateImagesByUrl(HotelMerger.mergeArrays(images.map((img) => img.rooms || []))),
      site: deduplicateImagesByUrl(HotelMerger.mergeArrays(images.map((img) => img.site || []))),
      amenities: deduplicateImagesByUrl(HotelMerger.mergeArrays(images.map((img) => img.amenities || [])))
    }
  }

  static mergeAmenities(amenities: IAmenities[]): IAmenities {
    const longerGeneralArray = HotelMerger.getLongestArray(amenities.map((a) => a.general || []))
    const longerRoomArray = HotelMerger.getLongestArray(amenities.map((a) => a.room || []))
    return {
      general: HotelMerger.deduplicateArray(longerGeneralArray),
      room: HotelMerger.deduplicateArray(longerRoomArray)
    }
  }

  static getFirstValidValue(hotels: any[], fields: string): any {
    const fieldPath = fields.split('.')

    for (const hotel of hotels) {
      let value: any = hotel
      for (const field of fieldPath) {
        value = value?.[field]
        if (value === undefined || value === null || value === '') break
      }

      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        (typeof value !== 'object' || Object.keys(value).length > 0)
      ) {
        return value
      }
    }
    return null
  }

  static mergeLocation(locations: ILocation[]): ILocation {
    const validLocations = locations.filter((loc) => loc !== null && loc !== undefined)
    if (validLocations.length === 0) return {} as ILocation

    const countries = validLocations
      .map((loc) => loc.country)
      .filter((country) => country !== null && country !== undefined && country.trim() !== '')

    return {
      lat: HotelMerger.getFirstValidValue(validLocations, 'lat'),
      lng: HotelMerger.getFirstValidValue(validLocations, 'lng'),
      address: HotelMerger.getFirstValidValue(validLocations, 'address') || '',
      city: HotelMerger.getFirstValidValue(validLocations, 'city') || '',
      country: HotelMerger.getLongestString(countries) || ''
    }
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
      const mergedHotel: IHotel = {
        id: HotelMerger.getFirstValidValue(groupedHotels, 'id') || '',
        destination_id: HotelMerger.getFirstValidValue(groupedHotels, 'destination_id') || '',
        name: HotelMerger.getLongestString(groupedHotels.map((hotel) => hotel.name)),
        location: HotelMerger.mergeLocation(groupedHotels.map((hotel) => hotel.location)),
        description: HotelMerger.getLongestString(groupedHotels.map((hotel) => hotel.description)),
        amenities: HotelMerger.mergeAmenities(groupedHotels.map((hotel) => hotel.amenities)),
        images: HotelMerger.mergeImages(groupedHotels.map((hotel) => hotel.images)),
        booking_conditions: HotelMerger.mergeArrays(groupedHotels.map((hotel) => hotel.booking_conditions || []))
      }
      this.data.push(mergedHotel)
    }
  }

  find = (hotelIds: string[], destinationIds: string[]): IHotel[] => {
    // if (hotelIds.length === 1 && hotelIds[0] === '' && destinationIds.length === 1 && destinationIds[0] === '') {
    //   return this.data
    // }

    if (hotelIds.includes('none') || destinationIds.includes('none')) {
      return this.data
    }

    const isHotelIdMatch = (hotel: IHotel) => hotelIds.length === 0 || hotelIds.includes(hotel.id)
    const isDestinationIdMatch = (hotel: IHotel) =>
      destinationIds.length === 0 || destinationIds.includes(hotel.destination_id)

    return this.data.filter((hotel) => isHotelIdMatch(hotel) && isDestinationIdMatch(hotel))
  }
}
