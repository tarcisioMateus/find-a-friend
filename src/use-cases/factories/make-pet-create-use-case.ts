import { CreateUseCase } from '../pet/Create'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PrismaRequiredForAdoptionRepository } from '@/repositories/prisma/prisma-required-for-adoption-repository'

export const makePetCreateUseCase = new CreateUseCase(
  new PrismaPetsRepository(),
  new PrismaRequiredForAdoptionRepository(),
)
