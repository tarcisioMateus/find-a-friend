import { FastifyInstance } from 'fastify'
import { OrgsController } from '../controllers/OrgsController'
import { verifyJWT } from '../middlewares/verify-jwt'

const orgs = new OrgsController()
export async function routes(app: FastifyInstance) {
  app.post('/singUp', orgs.SingUp)
  app.post('/singIn', orgs.SingIn)
  app.patch('/token/refresh', orgs.Refresh)
  app.get('/me', { onRequest: [verifyJWT] }, orgs.Profile)
}
