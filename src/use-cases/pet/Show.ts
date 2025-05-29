import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { RequiredForAdoptionRepository } from '@/repositories/required-for-adoption-repository'
import { Size, Age, Level, RequiredForAdoption } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

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

  address: string
  whatsapp: string
  requirements: RequiredForAdoption[]
}
interface ShowUseCaseResponse {
  pet: null | PetWithRequirements
}

export class ShowUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
    private requiredForAdoptionRepository: RequiredForAdoptionRepository,
  ) {}

  async execute({ id }: ShowUseCaseRequest): Promise<ShowUseCaseResponse> {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      return { pet }
    }

    const requirements: RequiredForAdoption[] =
      await this.requiredForAdoptionRepository.listByPetId(pet.id)

    const org = await this.orgsRepository.findById(pet.org_id)
    if (!org) {
      throw new ResourceNotFoundError()
    }

    const petWithRequirements: PetWithRequirements = {
      ...pet,
      address: org.address,
      whatsapp: org.whatsapp,
      requirements,
    }

    return { pet: petWithRequirements }
  }
}
