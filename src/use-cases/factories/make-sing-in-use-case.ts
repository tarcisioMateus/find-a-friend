import { SingInUseCase } from '@/use-cases/org/SingIn'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

export const makeSingInUseCase = new SingInUseCase(new PrismaOrgsRepository())
