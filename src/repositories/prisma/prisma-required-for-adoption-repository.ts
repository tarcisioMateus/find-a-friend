import { Prisma, RequiredForAdoption } from '@prisma/client'
import { RequiredForAdoptionRepository } from '../required-for-adoption-repository'
import { prisma } from '@/lib/prisma'

export class PrismaRequiredForAdoptionRepository
  implements RequiredForAdoptionRepository
{
  public RequiredForAdoption: RequiredForAdoption[] = []

  async create(
    data: Prisma.RequiredForAdoptionUncheckedCreateInput,
  ): Promise<void> {
    await prisma.requiredForAdoption.create({ data })
  }

  async listByPetId(petId: string): Promise<RequiredForAdoption[]> {
    const requirements: RequiredForAdoption[] =
      await prisma.requiredForAdoption.findMany({
        where: { pet_id: petId },
      })

    return requirements
  }
}
