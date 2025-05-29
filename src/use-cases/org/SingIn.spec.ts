import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { SingInUseCase } from './SingIn'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: SingInUseCase

describe('SingIn Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new SingInUseCase(orgsRepository)
  })

  it('should be able to SingIn', async () => {
    await orgsRepository.create({
      name: 'Org1',
      email: 'org@gmail.com',
      hashed_password: await hash('123456', 6),
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
      city: '',
    })

    const { org } = await sut.execute({
      email: 'org@gmail.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should NOT be able to SingIn', async () => {
    await orgsRepository.create({
      name: 'Org1',
      email: 'org@gmail.com',
      hashed_password: await hash('123456', 6),
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
      city: '',
    })

    await expect(() =>
      sut.execute({
        email: 'org@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
