import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { SingUpUseCase } from './SingUp'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'

describe('SingUp Use Case', () => {
  it('should be able to SingUP', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new SingUpUseCase(orgsRepository)

    const { org } = await sut.execute({
      name: 'Org1',
      email: 'org@gmail.com',
      password: '123456',
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new SingUpUseCase(orgsRepository)

    const { org } = await sut.execute({
      name: 'Org1',
      email: 'org@gmail.com',
      password: '123456',
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      org.hashed_password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should NOT be able to SingUP with same email twice', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new SingUpUseCase(orgsRepository)

    const email = 'org@gmail.com'

    await sut.execute({
      name: 'Org1',
      email,
      password: '123456',
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
    })

    await expect(() =>
      sut.execute({
        name: 'Org2',
        email,
        password: '123456',
        address: 'main street studio 96',
        zipCode: '123456',
        whatsapp: '98765-4321',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
