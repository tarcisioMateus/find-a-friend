import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryGeocodingService } from '@/integrations/opencage/in-memory-geocoding-service'
import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { SingUpUseCase } from '@/use-cases/org/SingUp'
import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'

const inMemoryGeocodingService = new InMemoryGeocodingService()
let orgsRepository: InMemoryOrgsRepository
let sut: SingUpUseCase

describe('SingUp Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new SingUpUseCase(orgsRepository, inMemoryGeocodingService)
  })

  it('should be able to SingUP', async () => {
    const org = await sut.execute({
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
    const org = await sut.execute({
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
