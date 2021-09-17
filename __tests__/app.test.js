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
      const { body: { users } } = await request.get('/api/users')
      .expect(200)
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0)
      users.forEach((user) => {
          expect(user).toEqual(
              expect.objectContaining({
              user_id: expect.any(String),
              bio: expect.any(String),
              avatar_url: expect.any(String),
              username: expect.any(String),
              })
          );
        });
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
      const { body: { routes } } = await request.get('/api/routes')
      .expect(200)
      expect(routes).toBeInstanceOf(Array);
      expect(routes.length).toBeGreaterThan(0)
      routes.forEach((route) => {
          expect(route).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                user_id: expect.any(String),
                coords: expect.any(Array),
                start_time_date: expect.any(String)
              })
          );
        });    
      })
    it('a route should contain valid coords', async () => {
      const { body: { routes } } = await request.get('/api/routes')
      .expect(200)
      routes[0].coords.forEach(coord => {
        expect(coord).toEqual(
          expect.objectContaining({
            longitude: expect.any(String),
            latitude: expect.any(String),
            time: expect.any(String),
        }))
      }) 
      })

  })
  describe('GET -/routes/route_id', () => {
    it('should get a single route by its id', async () => {
      const res = await request
        .get('/api/routes/6143a704366e787fcfb34286')
        .expect(200)

      expect(res.body.route).toEqual(
        expect.objectContaining({
          _id: '6143a704366e787fcfb34286',
          title: 'aut aut praesentium',
          description: 'Porro et ea perspiciatis quibusdam. Repellendus omnis sunt magnam ipsum.',
          coords: expect.any(Array),
          start_time_date: '2018-10-02T08:37:14.590Z'
          })
      )
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
      expect(res.body.route).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          title: 'My First Post',
          description: 'my first walk',
          user_id: '6143a704366e787fcfb34282',
          coords: expect.any(Array),
          start_time_date: expect.any(String)
          })
      )
    })
    it('reject with 400 given a request with missing title', async () => {
      const testRequest = {
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
        start_time_date: new Date(),
      }
      const res = await request
        .post('/api/routes')
        .send(testRequest)
        .expect(400)
      expect(res.body.msg).toBe('Bad request')
    });
    it('reject with 400 given a request with missing coordinates', async () => {
      const testRequest = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        start_time_date: new Date(),
      }
      const res = await request
        .post('/api/routes')
        .send(testRequest)
        .expect(400)
      expect(res.body.msg).toBe('Bad request')
    });
    it('reject with 400 given a request with missing user_id', async () => {
      const testRequest = {
        title: 'My First Post',
        description: 'my first walk',
        coords: parseStrava(testCoords),
        start_time_date: new Date(),
      }
      const res = await request
        .post('/api/routes')
        .send(testRequest)
        .expect(400)
      expect(res.body.msg).toBe('Bad request')
    });
    it('reject with 400 given a request with missing start_time', async () => {
      const testRequest = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
      }
      const res = await request
        .post('/api/routes')
        .send(testRequest)
        .expect(400)
      expect(res.body.msg).toBe('Bad request')
    });
  })
})
