import { Prisma, RequiredForAdoption } from '@prisma/client'

export interface RequiredForAdoptionRepository {
  create(
    data: Prisma.RequiredForAdoptionUncheckedCreateInput,
  ): Promise<RequiredForAdoption>
  listByPetId(petId: string): Promise<RequiredForAdoption[]>
}
