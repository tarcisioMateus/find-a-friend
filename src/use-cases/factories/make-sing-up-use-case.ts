import { SingUpUseCase } from '@/use-cases/org/SingUp'
import { GeocodingService } from '@/integrations/opencage/geocoding-service'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

export const makeSingUpUseCase = new SingUpUseCase(
  new PrismaOrgsRepository(),
  new GeocodingService(),
)
