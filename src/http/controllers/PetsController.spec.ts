import request from 'supertest'
import { app } from '@/app'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { Size, Age, Level } from '@prisma/client'

let token: string
let city: string
const address = 'main street studio 96'
const whatsapp = '98765-4321'

describe('PetsController e2e', () => {
  beforeAll(async () => {
    await app.ready()

    const singUpOrgResponse = await request(app.server).post('/singUp').send({
      name: 'Org1',
      email: 'org@gmail.com',
      password: '123456',
      address,
      zipCode: '07008',
      whatsapp,
    })
    city = singUpOrgResponse.body.org.city
    const singInResponse = await request(app.server).post('/singIn').send({
      email: 'org@gmail.com',
      password: '123456',
    })

    token = singInResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Create a Pets', async () => {
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

  it('should be able to Filter Pets', async () => {
    await request(app.server)
      .post('/pet/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'dog 2',
        about: 'cute',
        size: Size.SMALL,
        age: Age.PUPPY,
        energy_levels: Level.THREE,
        independency_levels: Level.ONE,
        requirements: ['requirement 1', 'requirement 2', 'requirement 3'],
      })

    await request(app.server)
      .post('/pet/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'dog 3',
        about: 'cute',
        size: Size.LARGE,
        age: Age.ADULT,
        energy_levels: Level.THREE,
        independency_levels: Level.TWO,
        requirements: ['requirement 1', 'requirement 2', 'requirement 3'],
      })

    await request(app.server)
      .post('/pet/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'dog 4',
        about: 'cute',
        size: Size.SMALL,
        age: Age.PUPPY,
        energy_levels: Level.THREE,
        independency_levels: Level.ONE,
        requirements: ['requirement 1', 'requirement 2', 'requirement 3'],
      })

    await request(app.server)
      .post('/pet/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'dog 5',
        about: 'cute',
        size: Size.SMALL,
        age: Age.PUPPY,
        energy_levels: Level.THREE,
        independency_levels: Level.ONE,
        requirements: ['requirement 1', 'requirement 2', 'requirement 3'],
      })

    const response = await request(app.server).get('/pet/filter').query({
      city,
      size: Size.SMALL,
      age: Age.PUPPY,
      energy_levels: Level.THREE,
      independency_levels: Level.ONE,
    })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(4)
  })

  it('should be able to Show a Pets', async () => {
    const createPetResponse = await request(app.server)
      .post('/pet/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'cat 1',
        about: 'cute',
        size: Size.SMALL,
        age: Age.PUPPY,
        energy_levels: Level.THREE,
        independency_levels: Level.ONE,
        requirements: ['requirement 21', 'requirement 25', 'requirement 30'],
      })
    const pet_id = createPetResponse.body.pet.id

    const response = await request(app.server).get(`/pet/show/${pet_id}`).send()

    expect(response.status).toBe(200)
    console.log(response.body)
    expect(response.body.whatsapp).toEqual(whatsapp)
    expect(response.body.address).toEqual(address)
    expect(response.body.requirements).toHaveLength(3)
    expect(response.body.requirements[0]).toEqual(
      expect.objectContaining({ name: 'requirement 21' }),
    )
  })
})
