import { Prisma, RequiredForAdoption } from '@prisma/client'

export interface RequiredForAdoptionRepository {
  create(data: Prisma.RequiredForAdoptionUncheckedCreateInput): Promise<void>
  listByPetId(petId: string): Promise<RequiredForAdoption[]>
}
