export interface GeocodingServiceInterface {
  getCityFromZipCode(zipCode: string): Promise<string | null>
}
