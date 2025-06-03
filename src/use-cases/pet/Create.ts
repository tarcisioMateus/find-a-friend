import { PetsRepository } from '@/repositories/pets-repository'
import { RequiredForAdoptionRepository } from '@/repositories/required-for-adoption-repository'
import { Size, Age, Level, RequiredForAdoption } from '@prisma/client'

interface CreateUseCaseRequest {
  name: string
  about: string
  size: Size
  age: Age
  energy_levels: Level
  independency_levels: Level
  org_id: string
  requirements: string[]
}

export interface CreateUseCaseResponse {
  name: string
  about: string
  size: Size
  age: Age
  energy_levels: Level
  independency_levels: Level
  org_id: string
  requirements: RequiredForAdoption[]
}

export class CreateUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private requiredRepository: RequiredForAdoptionRepository,
  ) {}

  async execute({
    name,
    about,
    size,
    age,
    energy_levels,
    independency_levels,
    org_id,
    requirements,
  }: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      about,
      size,
      age,
      energy_levels,
      independency_levels,
      org_id,
    })

    const requiredForAdoption: RequiredForAdoption[] = []
    for (const value of requirements) {
      const newRequirement = await this.requiredRepository.create({
        name: value,
        pet_id: pet.id,
      })
      requiredForAdoption.push(newRequirement)
    }

    return { ...pet, requirements: requiredForAdoption }
  }
}
