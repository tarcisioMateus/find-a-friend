import { Prisma, Pet, Size, Age, Level } from '@prisma/client'

export interface FilterPetsResponse {
  name: string
  id: string
}

export interface FilterPetsRequest {
  city: string
  size: Size | null
  age: Age | null
  energy_levels: Level | null
  independency_levels: Level | null
  orgs_id?: string[] // needs to be provided only inMemory so it does work
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  filter(filterRequest: FilterPetsRequest): Promise<FilterPetsResponse[]>
}
