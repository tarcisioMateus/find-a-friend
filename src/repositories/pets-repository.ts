import { Prisma, Pet, Size, Age, Level } from '@prisma/client'

export interface FilterPetsResponse {
  response: { name: string; id: string }[]
}

export interface FilterPetsRequest {
  city: string
  size?: Size
  age?: Age
  energy_levels?: Level
  independency_levels?: Level
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  filter(filterRequest: FilterPetsRequest): Promise<FilterPetsResponse>
}
