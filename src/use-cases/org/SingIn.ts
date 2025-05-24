import { OrgsRepository } from '@/repositories/orgs-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { Org } from '@prisma/client'

interface SingInUseCaseRequest {
  email: string
  password: string
}

interface SingInUseCaseResponse {
  org: Org
}

export class SingInUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: SingInUseCaseRequest): Promise<SingInUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, org.hashed_password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}
