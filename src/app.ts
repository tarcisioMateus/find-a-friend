import fastify from 'fastify'
// import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { env } from './env'
import { routes } from './http/routes'

export const app = fastify()
app.register(routes)
// app.register(fastifyJwt, { secret: env.JWT_SECRET })

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply
    .status(500)
    .send({ message: 'Internal server error.', issues: error.code })
})
