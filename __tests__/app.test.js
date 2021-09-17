const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const {
  Route,
  Comment,
  User,
  Follow,
  Poi,
  CommentLike,
  RouteLike,
} = require('../schemas/index')
const mongoose = require('mongoose')
const setupTests = require('../setup-tests')
const testCoords = require('../db/data/gpx/gpx1')
const { parseStrava } = require('../utils')

beforeEach(async () => {
  await setupTests.seedAllCollections()
})

afterEach(async () => {
  await setupTests.removeAllCollections()
})

afterAll(async () => {
  await setupTests.dropAllCollections()
  await mongoose.connection.close()
})

describe('Users', () => {
  describe('GET - /users', () => {
    it('should ', async () => {
      const res = await request.get('/api/users')
      expect(res.body.users).toEqual()
    })
  })
  describe('GET -/users/:username', () => {
    it('should return a user profile', async () => {
      const res = await request.get('/api/users/Shanna81')
      expect(res.body.user.username).toEqual('Shanna81')
    })
  })
})

describe('Route', () => {
  describe('GET - /routes', () => {
    it('should get all routes', async () => {
      const res = await request.get('/api/routes')
      expect(res.body.routes).toEqual()
    })
  })
  describe('GET -/routes/route_id', () => {
    it.only('should get a single route by its id', async () => {
      const res = await request
        .get('/api/routes/6143a704366e787fcfb34286')
        .expect(200)

      expect(res.body).toEqual({})
    })
  })
  describe('POST - /routes', () => {
    it('should post a route', async () => {
      const testRequest = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
        start_time_date: new Date(),
      }

      const res = await request
        .post('/api/routes')
        .send(testRequest)
        .expect(201)

      expect(res).toEqual({})
    })
  })
})
