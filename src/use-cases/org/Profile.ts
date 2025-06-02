import { OrgsRepository } from '@/repositories/orgs-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export interface ProfileUseCaseResponse {
  id: string
  name: string
  email: string
  address: string
  zipCode: string
  city: string
  whatsapp: string
}

export class ProfileUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(id: string): Promise<ProfileUseCaseResponse> {
    const org = await this.orgsRepository.findById(id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const { name, email, address, zipCode, city, whatsapp } = org
    return { id, name, email, address, zipCode, city, whatsapp }
  }
}
