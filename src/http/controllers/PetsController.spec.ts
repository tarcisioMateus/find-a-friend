import request from 'supertest'
import { app } from '@/app'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { Size, Age, Level } from '@prisma/client'

let token: string

describe('PetsController e2e', () => {
  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/singUp').send({
      name: 'Org1',
      email: 'org@gmail.com',
      password: '123456',
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
    })
    const singInResponse = await request(app.server).post('/singIn').send({
      email: 'org@gmail.com',
      password: '123456',
    })

    token = singInResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Create a Pet', async () => {
    const response = await request(app.server)
      .post('/pet/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'dog 1',
        about: 'cute',
        size: Size.SMALL,
        age: Age.PUPPY,
        energy_levels: Level.THREE,
        independency_levels: Level.ONE,
        requirements: ['requirement 1', 'requirement 2', 'requirement 3'],
      })
    expect(response.status).toBe(201)
  })
})
