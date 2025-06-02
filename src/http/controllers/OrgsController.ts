import { InvalidZipCodeError } from '@/use-cases/errors/invalid-zip-code-error'
import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { Org } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { SingUpUseCase } from '@/use-cases/org/SingUp'
import { GeocodingService } from '@/integrations/opencage/geocoding-service'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

const singUpUseCase = new SingUpUseCase(
  new PrismaOrgsRepository(),
  new GeocodingService(),
)

export class OrgsController {
  async SingUp(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      address: z.string(),
      zipCode: z.string(),
      whatsapp: z.string(),
    })

    const data = bodySchema.parse(req.body)

    let org: Org
    try {
      org = await singUpUseCase.execute(data)
    } catch (error) {
      if (error instanceof OrgAlreadyExistsError) {
        return reply.status(400).send({ message: error.message })
      }
      if (error instanceof InvalidZipCodeError) {
        return reply.status(400).send({ message: error.message })
      }
      throw error
    }

    return reply.status(201).send({ org })
  }
}
