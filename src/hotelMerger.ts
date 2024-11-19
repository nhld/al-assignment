import { IHotel, ILocation, IAmenities, IImages, IImage } from './interfaces/interfaces'

class HotelMerger {
  static getLongestString = (strings: string[]): string => {
    let longestString = ''
    for (const str of strings) {
      if ((str?.length || 0) > longestString.length) {
        longestString = str
      }
    }
    return longestString
  }

  static mergeArrays = <T>(arrays: T[][]): T[] => {
    return [...new Set(arrays.flat())]
  }

  static deduplicateArray = (arr: string[]): string[] => {
    const unique = new Set(arr.filter((item) => item.length > 0))
    return Array.from(unique)
  }

  static getLongestArray = (arrays: string[][]): string[] => {
    let longest: string[] = []
    for (const arr of arrays) {
      if (!arr) continue
      if (arr.length > longest.length) {
        longest = arr
      }
    }
    return longest
  }

  private static deduplicateImagesByUrl = (imageArray: IImage[]) => {
    const uniqueUrls = new Set<string>()
    return imageArray.filter((img) => {
      if (!img.link || uniqueUrls.has(img.link)) {
        return false
      }
      uniqueUrls.add(img.link)
      return true
    })
  }

  static mergeImages = (images: IImages[]): IImages => {
    return {
      rooms: this.deduplicateImagesByUrl(HotelMerger.mergeArrays(images.map((img) => img.rooms || []))),
      site: this.deduplicateImagesByUrl(HotelMerger.mergeArrays(images.map((img) => img.site || []))),
      amenities: this.deduplicateImagesByUrl(HotelMerger.mergeArrays(images.map((img) => img.amenities || [])))
    }
  }

  static mergeAmenities = (amenities: IAmenities[]): IAmenities => {
    const longerGeneralArray = HotelMerger.getLongestArray(amenities.map((a) => a.general || []))
    const longerRoomArray = HotelMerger.getLongestArray(amenities.map((a) => a.room || []))
    return {
      general: HotelMerger.deduplicateArray(longerGeneralArray),
      room: HotelMerger.deduplicateArray(longerRoomArray)
    }
  }

  static getFirstValidValue = (hotels: any[], fields: string): any => {
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

  static mergeLocation = (locations: ILocation[]): ILocation => {
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

  private createGroupKey = (hotel: IHotel): string => {
    if (!hotel.id || !hotel.destination_id) {
      throw new Error('Hotel missing required ID fields')
    }
    return `${hotel.id}|${hotel.destination_id}`
  }

  private groupHotels = (hotels: IHotel[]): Map<string, IHotel[]> => {
    return hotels.reduce((groups, currentHotel) => {
      const key = this.createGroupKey(currentHotel)
      const existing = groups.get(key) || []
      groups.set(key, [...existing, currentHotel])
      return groups
    }, new Map<string, IHotel[]>())
  }

  private merge = (groups: Map<string, IHotel[]>): void => {
    for (const groupedHotels of groups.values()) {
      const mergedHotel: IHotel = {
        id: HotelMerger.getFirstValidValue(groupedHotels, 'id') || '',
        destination_id: HotelMerger.getFirstValidValue(groupedHotels, 'destination_id') || '',
        name: HotelMerger.getLongestString(groupedHotels.map((h) => h.name)),
        location: HotelMerger.mergeLocation(groupedHotels.map((h) => h.location)),
        description: HotelMerger.getLongestString(groupedHotels.map((h) => h.description)),
        amenities: HotelMerger.mergeAmenities(groupedHotels.map((h) => h.amenities)),
        images: HotelMerger.mergeImages(groupedHotels.map((h) => h.images)),
        booking_conditions: HotelMerger.mergeArrays(groupedHotels.map((h) => h.booking_conditions || []))
      }
      this.data.push(mergedHotel)
    }
  }

  mergeAndSave = (hotels: IHotel[]): void => {
    if (!hotels || hotels.length === 0) {
      throw new Error('No hotels to merge')
    }
    const hotelGroups = this.groupHotels(hotels)
    this.merge(hotelGroups)
  }

  find = (hotelIds: string[], destinationIds: string[]): IHotel[] => {
    if (hotelIds.length === 1 && hotelIds[0] === '' && destinationIds.length === 1 && destinationIds[0] === '') {
      return this.data
    }

    if (hotelIds.includes('none') || destinationIds.includes('none')) {
      return this.data
    }

    return this.data.filter((hotel) => {
      const matchesHotelId = hotelIds.length === 0 || hotelIds.includes(hotel.id)
      const matchesDestinationId = destinationIds.length === 0 || destinationIds.includes(hotel.destination_id)

      return matchesHotelId && matchesDestinationId
    })
  }
}
