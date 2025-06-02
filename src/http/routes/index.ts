import { FastifyInstance } from 'fastify'
import { OrgsController } from '../controllers/OrgsController'

const orgs = new OrgsController()
export async function routes(app: FastifyInstance) {
  app.post('/singUp', orgs.SingUp)
}
