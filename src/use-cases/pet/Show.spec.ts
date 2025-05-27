import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryRequiredForAdoptionRepository } from '@/repositories/in-memory/in-memory-required-for-adoption-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { ShowUseCase } from './Show'
import { Size, Age, Level } from '@prisma/client'

let petsRepository: InMemoryPetsRepository
let requiredForAdoptionRepository: InMemoryRequiredForAdoptionRepository
let sut: ShowUseCase

describe('Show Pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    requiredForAdoptionRepository = new InMemoryRequiredForAdoptionRepository()
    sut = new ShowUseCase(petsRepository, requiredForAdoptionRepository)
  })

  it('should be able to Show a pet', async () => {
    const pet = await petsRepository.create({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: 'org 1',
    })

    await requiredForAdoptionRepository.create({
      name: 'requirement 1',
      pet_id: pet.id,
    })
    await requiredForAdoptionRepository.create({
      name: 'requirement 2',
      pet_id: pet.id,
    })
    const response = await sut.execute({ id: pet.id })

    if (!response.pet) {
      throw new Error()
    }
    expect(response.pet.requirements).toHaveLength(2)
  })

  it('should only be able to get the pets requirements', async () => {
    const pet = await petsRepository.create({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: 'org 1',
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
    const response = await sut.execute({ id: pet.id })

    if (!response.pet) {
      throw new Error()
    }
    expect(response.pet.requirements).toHaveLength(2)
    expect(response.pet.requirements[0]).toEqual(
      expect.objectContaining({ name: 'requirement 1' }),
    )
    expect(response.pet.requirements[1]).toEqual(
      expect.objectContaining({ name: 'requirement 2' }),
    )
  })
})
