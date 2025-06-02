import { FastifyRequest, FastifyReply } from 'fastify'
import { Size, Age, Level } from '@prisma/client'
import { CreateUseCaseResponse } from '@/use-cases/pet/Create'
import { z } from 'zod'

import { makePetCreateUseCase } from '@/use-cases/factories/make-pet-create-use-case'

export class PetsController {
  async Create(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      size: z.nativeEnum(Size),
      age: z.nativeEnum(Age),
      energy_levels: z.nativeEnum(Level),
      independency_levels: z.nativeEnum(Level),
      name: z.string(),
      about: z.string(),
      requirements: z.array(z.string()),
    })

    const {
      name,
      about,
      size,
      age,
      energy_levels,
      independency_levels,
      requirements,
    } = bodySchema.parse(req.body)

    const pet: CreateUseCaseResponse = await makePetCreateUseCase.execute({
      name,
      about,
      size,
      age,
      energy_levels,
      independency_levels,
      org_id: req.user.sub,
      requirements,
    })

    return reply.status(201).send({ pet })
  }
}
