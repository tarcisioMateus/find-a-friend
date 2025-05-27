import { RequiredForAdoptionRepository } from '@/repositories/required-for-adoption-repository'

interface CreateUseCaseRequest {
  name: string
  pet_id: string
}

export class CreateUseCase {
  constructor(
    private requiredForAdoptionRepository: RequiredForAdoptionRepository,
  ) {}

  async execute({ name, pet_id }: CreateUseCaseRequest): Promise<void> {
    await this.requiredForAdoptionRepository.create({
      name,
      pet_id,
    })
  }
}
