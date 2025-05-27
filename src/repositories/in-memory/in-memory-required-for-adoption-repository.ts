import { Prisma, RequiredForAdoption } from '@prisma/client'
import { RequiredForAdoptionRepository } from '../required-for-adoption-repository'

export class InMemoryRequiredForAdoptionRepository
  implements RequiredForAdoptionRepository
{
  public RequiredForAdoption: RequiredForAdoption[] = []

  async create(
    data: Prisma.RequiredForAdoptionUncheckedCreateInput,
  ): Promise<void> {
    const Requirement: RequiredForAdoption = {
      id: this.RequiredForAdoption.length + 1,
      name: data.name,
      pet_id: data.pet_id,
    }
    this.RequiredForAdoption.push(Requirement)
  }

  async listByPetId(petId: string): Promise<RequiredForAdoption[] | null> {
    const requirements: RequiredForAdoption[] = this.RequiredForAdoption.filter(
      (item) => item.pet_id === petId,
    )

    if (requirements.length === 0) {
      return null
    }
    return requirements
  }
}
