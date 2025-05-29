import { Prisma, Pet } from '@prisma/client'
import {
  FilterPetsRequest,
  FilterPetsResponse,
  PetsRepository,
} from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public Pets: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const Pet: Pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      about: data.about,
      size: data.size,
      age: data.age,
      energy_levels: data.energy_levels ?? 'TWO',
      independency_levels: data.energy_levels ?? 'TWO',
      org_id: data.org_id,
    }
    this.Pets.push(Pet)

    return Pet
  }

  async findById(id: string): Promise<Pet | null> {
    const Pet = this.Pets.find((Pet) => Pet.id === id)

    if (!Pet) {
      return null
    }
    return Pet
  }

  async filter(
    filterRequest: FilterPetsRequest,
  ): Promise<FilterPetsResponse[]> {
    let pets = this.Pets.filter((pet) =>
      filterRequest.orgs_id?.includes(pet.org_id),
    )
    if (filterRequest.age) {
      pets = pets.filter((pet) => pet.age === filterRequest.age)
    }
    if (filterRequest.size) {
      pets = pets.filter((pet) => pet.size === filterRequest.size)
    }
    if (filterRequest.energy_levels) {
      pets = pets.filter(
        (pet) => pet.energy_levels === filterRequest.energy_levels,
      )
    }
    if (filterRequest.independency_levels) {
      pets = pets.filter(
        (pet) => pet.independency_levels === filterRequest.independency_levels,
      )
    }

    const filterPets = pets.map((pet) => {
      return { name: pet.name, id: pet.id }
    })

    return filterPets
  }
}
