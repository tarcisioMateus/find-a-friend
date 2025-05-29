import { Prisma, Org } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  public Orgs: Org[] = []

  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org: Org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      hashed_password: data.hashed_password,
      address: data.address,
      zipCode: data.zipCode,
      whatsapp: data.whatsapp,
      city: data.city,
    }
    this.Orgs.push(org)

    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = this.Orgs.find((org) => org.email === email)

    if (!org) {
      return null
    }
    return org
  }

  async findById(id: string): Promise<Org | null> {
    const Org = this.Orgs.find((Org) => Org.id === id)

    if (!Org) {
      return null
    }
    return Org
  }
}
