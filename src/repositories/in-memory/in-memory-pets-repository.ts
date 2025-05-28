import { Prisma, Pet } from '@prisma/client'
import {
  FilterPetsRequest,
  FilterPetsResponse,
  PetsRepository,
} from '../pets-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'

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

  async filter(filterRequest: FilterPetsRequest): Promise<FilterPetsResponse> {
    const orgsRepository = new InMemoryOrgsRepository()

    const city = orgsRepository.Orgs.filter(
      (item) => item.city === filterRequest.city,
    )
  }
}
