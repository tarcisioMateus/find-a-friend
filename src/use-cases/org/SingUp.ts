import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'
import { hash } from 'bcryptjs'
import { Org } from '@prisma/client'
import { GeocodingServiceInterface } from '@/integrations/opencage/geocoding-service-interface'
import { InvalidZipCodeError } from '../errors/invalid-zip-code-error'

interface SingUpUseCaseRequest {
  name: string
  email: string
  password: string
  address: string
  zipCode: string
  whatsapp: string
}

export class SingUpUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private geocodingServiceInterface: GeocodingServiceInterface,
  ) {}

  async execute({
    name,
    email,
    password,
    address,
    zipCode,
    whatsapp,
  }: SingUpUseCaseRequest): Promise<Org> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const hashed_password = await hash(password, 6)

    const city =
      await this.geocodingServiceInterface.getCityFromZipCode(zipCode)
    if (!city) {
      throw new InvalidZipCodeError()
    }

    const org = await this.orgsRepository.create({
      name,
      email,
      hashed_password,
      address,
      zipCode,
      city,
      whatsapp,
    })

    return org
  }
}
