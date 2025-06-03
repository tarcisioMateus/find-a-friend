import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

import { Size, Age, Level } from '@prisma/client'
import { FilterPetsResponse } from '@/repositories/pets-repository'
import { PetFullInfo } from '@/use-cases/pet/Show'
import { CreateUseCaseResponse } from '@/use-cases/pet/Create'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makePetCreateUseCase } from '@/use-cases/factories/make-pet-create-use-case'
import { makePetFilterUseCase } from '@/use-cases/factories/make-pet-filter-use-case'
import { makePetShowUseCase } from '@/use-cases/factories/make-pet-show-use-case'

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

  async Filter(req: FastifyRequest, reply: FastifyReply) {
    const querySchema = z.object({
      size: z.nativeEnum(Size).nullable(),
      age: z.nativeEnum(Age).nullable(),
      energy_levels: z.nativeEnum(Level).nullable(),
      independency_levels: z.nativeEnum(Level).nullable(),
      city: z.string(),
    })

    const { size, age, energy_levels, independency_levels, city } =
      querySchema.parse(req.query)
    let pets: FilterPetsResponse[]
    try {
      pets = await makePetFilterUseCase.execute({
        size,
        age,
        energy_levels,
        independency_levels,
        city,
      })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }

    return reply.status(200).send({ pets })
  }

  async Show(req: FastifyRequest, reply: FastifyReply) {
    const paramSchema = z.object({
      id: z.string(),
    })

    const { id } = paramSchema.parse(req.params)
    let pet: PetFullInfo
    try {
      pet = await makePetShowUseCase.execute(id)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }

    return reply.status(200).send(pet)
  }
}
