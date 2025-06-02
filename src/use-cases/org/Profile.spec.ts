import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { ProfileUseCase } from './Profile'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let sut: ProfileUseCase

describe('Profile Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new ProfileUseCase(orgsRepository)
  })

  it('should be able to get Profile', async () => {
    const orgCreates = await orgsRepository.create({
      name: 'Org1',
      email: 'org@gmail.com',
      hashed_password: await hash('123456', 6),
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
      city: '',
    })

    const org = await sut.execute(orgCreates.id)

    console.log(org)
    expect(org.id).toEqual(expect.any(String))
    expect(org).toEqual({
      id: org.id,
      name: 'Org1',
      email: 'org@gmail.com',
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
      city: '',
    })
  })

  it('should NOT be able get Profile with invalid ID', async () => {
    await expect(() => sut.execute('invalid-id')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
