import { ProfileUseCase } from '../org/Profile'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

export const makeProfileUseCase = new ProfileUseCase(new PrismaOrgsRepository())
