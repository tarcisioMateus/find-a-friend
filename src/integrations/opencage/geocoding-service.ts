import axios from 'axios'
import { env } from '@/env'
import { GeocodingServiceInterface } from './geocoding-service-interface'

const OPENCAGE_BASE_URL = 'https://api.opencagedata.com/geocode/v1/json'

interface OpenCageGeocodeResult {
  components: {
    city?: string
    town?: string
    village?: string
    // Add other relevant components if needed, e.g.,
    // postcode: string;
    // country: string;
    // state: string;
  }
  formatted: string // Full formatted address string
  geometry: {
    lat: number
    lng: number
  }
  confidence: number // A score indicating how confident the result is
}

interface OpenCageGeocodeResponse {
  results: OpenCageGeocodeResult[]
  status: {
    code: number
    message: string
  }
}

export class GeocodingService implements GeocodingServiceInterface {
  /**
   * Fetches the city name for a given zip code using the OpenCage Geocoding API.
   * @param zipCode The zip code to look up.
   * @returns The city name (string) or null if not found/error.
   */
  async getCityFromZipCode(zipCode: string): Promise<string | null> {
    try {
      const response = await axios.get<OpenCageGeocodeResponse>(
        OPENCAGE_BASE_URL,
        {
          params: {
            q: zipCode, // The query is the zip code
            key: env.OPENCAGE_API_KEY,
            // Optional: Add country code if you want to restrict results to a specific country
            // countrycode: 'us', // e.g., for United States
            limit: 1, // We only need the top result
          },
        },
      )

      const data = response.data

      if (data.status.code !== 200) {
        console.error(
          `OpenCage API Error: ${data.status.message} (Code: ${data.status.code})`,
        )
        return null
      }

      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0].components
        // OpenCage provides different levels of locality (city, town, village).
        // You might need to adjust the priority based on your data's typical structure.
        return (
          firstResult.city || firstResult.town || firstResult.village || null
        )
      } else {
        console.warn(`No city found for zip code: ${zipCode}`)
        return null
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Error calling OpenCage API: ${error.message}`,
          error.response?.data,
        )
      } else {
        console.error('An unexpected error occurred:', error)
      }
      return null
    }
  }
}

// Example usage (for testing purposes)
// (async () => {
//   const city = await getCityFromZipCode('90210'); // Example US zip code
//   if (city) {
//     console.log(`The city for 90210 is: ${city}`); // Expected: Beverly Hills
//   } else {
//     console.log('Could not determine city for 90210.');
//   }

//   const city2 = await getCityFromZipCode('SW1A 0AA'); // Example UK postcode
//   if (city2) {
//     console.log(`The city for SW1A 0AA is: ${city2}`); // Expected: London
//   } else {
//     console.log('Could not determine city for SW1A 0AA.');
//   }

//   const city3 = await getCityFromZipCode('INVALIDZIP');
//   if (city3) {
//     console.log(`The city for INVALIDZIP is: ${city3}`);
//   } else {
//     console.log('Could not determine city for INVALIDZIP.');
//   }
// })();
