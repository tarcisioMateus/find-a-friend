import { Prisma, Pet } from '@prisma/client'
import {
  FilterPetsRequest,
  FilterPetsResponse,
  PetsRepository,
} from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class InMemoryPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const Pet: Pet = await prisma.pet.create({ data })

    return Pet
  }

  async findById(id: string): Promise<Pet | null> {
    const Pet = await prisma.pet.findUnique({ where: { id } })

    if (!Pet) {
      return null
    }
    return Pet
  }

  async filter(
    filterRequest: FilterPetsRequest,
  ): Promise<FilterPetsResponse[]> {
    const petWhereClause: Prisma.PetWhereInput = {}

    if (filterRequest.age) {
      petWhereClause.age = filterRequest.age
    }
    if (filterRequest.size) {
      petWhereClause.size = filterRequest.size
    }
    if (filterRequest.energy_levels) {
      petWhereClause.energy_levels = filterRequest.energy_levels
    }
    if (filterRequest.independency_levels) {
      petWhereClause.independency_levels = filterRequest.independency_levels
    }

    // This is the "INNER JOIN" part in Prisma's declarative syntax
    if (filterRequest.city) {
      petWhereClause.org = {
        city: filterRequest.city,
      }
    }

    const filteredPets = await prisma.pet.findMany({
      where: petWhereClause,
      select: {
        name: true,
        id: true,
      },
    })

    return filteredPets
  }
}
