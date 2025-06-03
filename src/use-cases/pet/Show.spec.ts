import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryRequiredForAdoptionRepository } from '@/repositories/in-memory/in-memory-required-for-adoption-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { ShowUseCase } from './Show'
import { Size, Age, Level } from '@prisma/client'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let requiredForAdoptionRepository: InMemoryRequiredForAdoptionRepository
let sut: ShowUseCase

describe('Show Pets Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    requiredForAdoptionRepository = new InMemoryRequiredForAdoptionRepository()

    await orgsRepository.create({
      id: 'id 1',
      name: 'Org1',
      email: 'org@gmail.com',
      hashed_password: await hash('123456', 6),
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
      city: '',
    })

    sut = new ShowUseCase(
      petsRepository,
      orgsRepository,
      requiredForAdoptionRepository,
    )
  })

  it('should be able to Show a pet', async () => {
    const pet = await petsRepository.create({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: 'id 1',
    })

    await requiredForAdoptionRepository.create({
      name: 'requirement 1',
      pet_id: pet.id,
    })
    await requiredForAdoptionRepository.create({
      name: 'requirement 2',
      pet_id: pet.id,
    })
    const response = await sut.execute(pet.id)

    if (!response) {
      throw new Error()
    }
    expect(response.requirements).toHaveLength(2)
  })

  it('should only be able to get the pets requirements', async () => {
    const pet = await petsRepository.create({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: 'id 1',
    })

    await requiredForAdoptionRepository.create({
      name: 'requirement 1',
      pet_id: pet.id,
    })
    await requiredForAdoptionRepository.create({
      name: 'requirement 2',
      pet_id: pet.id,
    })
    await requiredForAdoptionRepository.create({
      name: 'pet-less requirement 1',
      pet_id: 'do-not-have-pet',
    })
    await requiredForAdoptionRepository.create({
      name: 'pet-less requirement 2',
      pet_id: 'do-not-have-pet',
    })
    const response = await sut.execute(pet.id)

    if (!response) {
      throw new Error()
    }
    expect(response.requirements).toHaveLength(2)
    expect(response.requirements[0]).toEqual(
      expect.objectContaining({ name: 'requirement 1' }),
    )
    expect(response.requirements[1]).toEqual(
      expect.objectContaining({ name: 'requirement 2' }),
    )
  })
})
