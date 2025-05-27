import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryRequiredForAdoptionRepository } from '@/repositories/in-memory/in-memory-required-for-adoption-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUseCase } from './Create'
import { Size, Age, Level } from '@prisma/client'

let petsRepository: InMemoryPetsRepository
let requiredForAdoptionRepository: InMemoryRequiredForAdoptionRepository
let sut: CreateUseCase

describe('Create Requirement Use Case', () => {
  beforeEach(() => {
    requiredForAdoptionRepository = new InMemoryRequiredForAdoptionRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new CreateUseCase(requiredForAdoptionRepository)
  })

  it('should be able to Create a requirement with a pet', async () => {
    const pet = await petsRepository.create({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: 'org 1',
    })

    await sut.execute({ name: 'requirement 1', pet_id: pet.id })
    await sut.execute({ name: 'requirement 2', pet_id: pet.id })

    expect(requiredForAdoptionRepository.RequiredForAdoption).toHaveLength(2)
  })
})
