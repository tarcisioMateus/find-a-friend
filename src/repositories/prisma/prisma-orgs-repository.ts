import { Prisma, Org } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org: Org = await prisma.org.create({ data })

    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({ where: { email } })

    if (!org) {
      return null
    }
    return org
  }

  async findById(id: string): Promise<Org | null> {
    const Org = await prisma.org.findUnique({ where: { id } })

    if (!Org) {
      return null
    }
    return Org
  }
}
