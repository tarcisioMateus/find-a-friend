import {
  PetsRepository,
  FilterPetsResponse,
  FilterPetsRequest,
} from '@/repositories/pets-repository'

export class FilterUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(filters: FilterPetsRequest): Promise<FilterPetsResponse> {
    const pets = await this.petsRepository.filter(filters)

    return pets
  }
}
