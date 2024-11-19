export class DataCleaningHelper {
  static cleanData(data: string): string {
    return data.trim()
  }

  static removeTripleEqualSigns = (strings: string[]): string[] => {
    return strings.map((str) =>
      str
        .split('===')
        .filter((part) => part.trim().length > 0)
        .map((part) => part.trim())
        .join(' ')
    )
  }

  static lowercaseArrayElements = (strings: string[] | null | undefined): string[] => {
    if (!strings) return []
    return strings.map((str) => str?.toLowerCase() || '')
  }

  static normalizeCamelCaseStrings = (strings: string[]): string[] => {
    return strings.map((str) =>
      str
        // Add space before capital letters
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
    )
  }
}
