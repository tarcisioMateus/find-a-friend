import { FilterUseCase } from '../pet/Filter'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'

export const makePetFilterUseCase = new FilterUseCase(
  new PrismaPetsRepository(),
)
