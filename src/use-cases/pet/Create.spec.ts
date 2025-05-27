import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUseCase } from './Create'
import { Size, Age, Level } from '@prisma/client'

let petsRepository: InMemoryPetsRepository
let sut: CreateUseCase

describe('Create Pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new CreateUseCase(petsRepository)
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
    })

    expect(response.pet.id).toEqual(expect.any(String))
  })
})
