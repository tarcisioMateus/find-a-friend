import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryRequiredForAdoptionRepository } from '@/repositories/in-memory/in-memory-required-for-adoption-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUseCase } from './Create'
import { Size, Age, Level } from '@prisma/client'

let petsRepository: InMemoryPetsRepository
let requirementsRepository: InMemoryRequiredForAdoptionRepository
let sut: CreateUseCase

describe('Create Pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    requirementsRepository = new InMemoryRequiredForAdoptionRepository()
    sut = new CreateUseCase(petsRepository, requirementsRepository)
  })

  it('should be able to SingIn', async () => {
    const response = await sut.execute({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: 'org 1',
      requirements: ['requirement 1', 'requirement 2'],
    })

    expect(response.pet.id).toEqual(expect.any(String))
    expect(response.requirements).toHaveLength(2)
    expect(response.requirements[0]).toEqual(
      expect.objectContaining({ name: 'requirement 1' }),
    )
  })
})
