import {
  PetsRepository,
  FilterPetsResponse,
  FilterPetsRequest,
} from '@/repositories/pets-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class FilterUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(filters: FilterPetsRequest): Promise<FilterPetsResponse[]> {
    const pets = await this.petsRepository.filter(filters)

    if (pets.length === 0) {
      throw new ResourceNotFoundError()
    }

    return pets
  }
}
