export class DataCleaningHelper {
  // '===' => " "
  static removeTripleEqualSigns = (strings: string[]): string[] => {
    return strings.map((str) =>
      str
        .split('===')
        .filter((part) => part.trim().length > 0)
        .map((part) => part.trim())
        .join(' ')
    )
  }

  // ["Abc", "Xyz"] => ["abc", "xyz"]
  static lowercaseArrayElements = (strings: string[] | null | undefined): string[] => {
    if (!strings) return []
    return strings.map((str) => str?.toLowerCase() || '')
  }

  // camelCase => camel case
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
