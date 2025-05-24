import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'
import { hash } from 'bcryptjs'
import { Org } from '@prisma/client'

interface SingUpUseCaseRequest {
  name: string
  email: string
  password: string
  address: string
  zipCode: string
  whatsapp: string
}

interface SingUpUseCaseResponse {
  org: Org
}

export class SingUpUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    address,
    zipCode,
    whatsapp,
  }: SingUpUseCaseRequest): Promise<SingUpUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const hashed_password = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      hashed_password,
      address,
      zipCode,
      whatsapp,
    })

    return { org }
  }
}
