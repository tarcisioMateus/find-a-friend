import { ShowUseCase } from '../pet/Show'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PrismaRequiredForAdoptionRepository } from '@/repositories/prisma/prisma-required-for-adoption-repository'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

export const makePetShowUseCase = new ShowUseCase(
  new PrismaPetsRepository(),
  new PrismaOrgsRepository(),
  new PrismaRequiredForAdoptionRepository(),
)
