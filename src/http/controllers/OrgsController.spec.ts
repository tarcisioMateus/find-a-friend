import request from 'supertest'
import { app } from '@/app'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'

describe('OrgsController e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to SingUP', async () => {
    const response = await request(app.server).post('/singUp').send({
      name: 'Org1',
      email: 'org@gmail.com',
      password: '123456',
      address: 'main street studio 96',
      zipCode: '123456',
      whatsapp: '98765-4321',
    })
    expect(response.status).toBe(201)
  })

  it('should be able to SingIN', async () => {
    const response = await request(app.server).post('/singIn').send({
      email: 'org@gmail.com',
      password: '123456',
    })
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ token: expect.any(String) })
  })

  it('should be able to Refresh token', async () => {
    const singInResponse = await request(app.server).post('/singIn').send({
      email: 'org@gmail.com',
      password: '123456',
    })

    const cookies = singInResponse.get('Set-Cookie')
    if (!cookies) {
      throw Error()
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ token: expect.any(String) })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })

  it('should be able to get Profile', async () => {
    const singInResponse = await request(app.server).post('/singIn').send({
      email: 'org@gmail.com',
      password: '123456',
    })

    const { token } = singInResponse.body

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.org).toEqual(
      expect.objectContaining({ email: 'org@gmail.com' }),
    )
  })
})
