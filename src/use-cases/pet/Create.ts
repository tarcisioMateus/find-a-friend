import { PetsRepository } from '@/repositories/pets-repository'
import { Size, Age, Level, Pet } from '@prisma/client'

interface CreateUseCaseRequest {
  name: string
  about: string
  size: Size
  age: Age
  energy_levels: Level
  independency_levels: Level
  org_id: string
}

interface CreateUseCaseResponse {
  pet: Pet
}

export class CreateUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    about,
    size,
    age,
    energy_levels,
    independency_levels,
    org_id,
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

    return { pet }
  }
}
