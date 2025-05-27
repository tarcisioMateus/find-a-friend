import { PetsRepository } from '@/repositories/pets-repository'
import { RequiredForAdoptionRepository } from '@/repositories/required-for-adoption-repository'
import { Size, Age, Level, RequiredForAdoption } from '@prisma/client'

interface ShowUseCaseRequest {
  id: string
}

interface PetWithRequirements {
  id: string
  name: string
  about: string
  size: Size
  age: Age
  energy_levels: Level
  independency_levels: Level
  org_id: string
  requirements: RequiredForAdoption[]
}
interface ShowUseCaseResponse {
  pet: null | PetWithRequirements
}

export class ShowUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private requiredForAdoptionRepository: RequiredForAdoptionRepository,
  ) {}

  async execute({ id }: ShowUseCaseRequest): Promise<ShowUseCaseResponse> {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      return { pet }
    }

    const requirements: RequiredForAdoption[] =
      await this.requiredForAdoptionRepository.listByPetId(pet.id)

    const petWithRequirements: PetWithRequirements = {
      ...pet,
      requirements,
    }

    return { pet: petWithRequirements }
  }
}
