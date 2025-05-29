import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FilterUseCase } from './Filter'
import { Size, Age, Level } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let sut: FilterUseCase

describe('Filter Pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new FilterUseCase(petsRepository)
  })

  it('should be able to list pets from a city', async () => {
    const newYork = ['id-1']
    const losAngels = ['id-2']

    await petsRepository.create({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: newYork[0],
    })
    await petsRepository.create({
      name: 'dog 2',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: newYork[0],
    })
    await petsRepository.create({
      name: 'dog 3',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: losAngels[0],
    })
    await petsRepository.create({
      name: 'dog 4',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: newYork[0],
    })

    const response = await sut.execute({
      city: 'New York',
      size: null,
      age: null,
      energy_levels: null,
      independency_levels: null,
      orgs_id: newYork,
    })

    expect(response).toHaveLength(3)
    expect(response[0]).toEqual(expect.objectContaining({ name: 'dog 1' }))
    expect(response[1]).toEqual(expect.objectContaining({ name: 'dog 2' }))
    expect(response[2]).toEqual(expect.objectContaining({ name: 'dog 4' }))
  })

  it('should be able to filter pets by SIZE, AGE, LEVEL', async () => {
    const newYork = ['id-1']

    await petsRepository.create({
      name: 'dog 1',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: newYork[0],
    })
    await petsRepository.create({
      name: 'dog 2',
      about: 'cute',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: newYork[0],
    })
    await petsRepository.create({
      name: 'dog 3',
      about: 'cute',
      size: Size.LARGE,
      age: Age.ADULT,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: newYork[0],
    })
    await petsRepository.create({
      name: 'dog 4',
      about: 'cute',
      size: Size.SMALL,
      age: Age.SENIOR,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
      org_id: newYork[0],
    })

    const response = await sut.execute({
      city: 'New York',
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: null,
      independency_levels: null,
      orgs_id: newYork,
    })

    expect(response).toHaveLength(2)
    expect(response[0]).toEqual(expect.objectContaining({ name: 'dog 1' }))
    expect(response[1]).toEqual(expect.objectContaining({ name: 'dog 2' }))
  })

  it('should raise error if found nothing', async () => {
    await expect(
      sut.execute({
        city: 'New York',
        size: Size.SMALL,
        age: Age.PUPPY,
        energy_levels: null,
        independency_levels: null,
        orgs_id: ['not results'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
