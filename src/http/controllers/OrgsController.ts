import { InvalidZipCodeError } from '@/use-cases/errors/invalid-zip-code-error'
import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

import { Org } from '@prisma/client'
import { ProfileUseCaseResponse } from '@/use-cases/org/Profile'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeSingUpUseCase } from '@/use-cases/factories/make-sing-up-use-case'
import { makeSingInUseCase } from '@/use-cases/factories/make-sing-in-use-case'
import { makeProfileUseCase } from '@/use-cases/factories/make-profile-use-case'

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
      org = await makeSingUpUseCase.execute(data)
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

  async SingIn(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const data = bodySchema.parse(req.body)

    let org: Org
    try {
      org = await makeSingInUseCase.execute(data)

      const token = await reply.jwtSign({}, { sign: { sub: org.id } })
      const refreshToken = await reply.jwtSign(
        {},
        { sign: { sub: org.id, expiresIn: '7d' } },
      )

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({ token })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(400).send({ message: error.message })
      }
      throw error
    }
  }

  async Refresh(req: FastifyRequest, reply: FastifyReply) {
    await req.jwtVerify({ onlyCookie: true })

    const token = await reply.jwtSign({}, { sign: { sub: req.user.sub } })
    const refreshToken = await reply.jwtSign(
      {},
      { sign: { sub: req.user.sub, expiresIn: '7d' } },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  }

  async Profile(req: FastifyRequest, reply: FastifyReply) {
    let org: ProfileUseCaseResponse
    try {
      org = await makeProfileUseCase.execute(req.user.sub)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return reply.status(400).send({ message: error.message })
      }
      throw error
    }
    return reply.status(200).send({ org })
  }
}
