import { FastifyInstance } from 'fastify'
import { OrgsController } from '../controllers/OrgsController'
import { PetsController } from '../controllers/PetsController'
import { verifyJWT } from '../middlewares/verify-jwt'

const orgs = new OrgsController()
const pets = new PetsController()

export async function routes(app: FastifyInstance) {
  app.post('/singUp', orgs.SingUp)
  app.post('/singIn', orgs.SingIn)
  app.patch('/token/refresh', orgs.Refresh)
  app.get('/me', { onRequest: [verifyJWT] }, orgs.Profile)

  app.post('/pet/create', { onRequest: [verifyJWT] }, pets.Create)
  app.get('/pet/filter', pets.Filter)
  app.get('/pet/show/:id', pets.Show)
}
