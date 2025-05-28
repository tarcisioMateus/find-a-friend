import { GeocodingServiceInterface } from './geocoding-service-interface'

export class InMemoryGeocodingService implements GeocodingServiceInterface {
  async getCityFromZipCode(zipCode: string): Promise<string | null> {
    if (Number(zipCode) < 10000) {
      return 'NEW YORK'
    }
    return 'PARIS'
  }
}
