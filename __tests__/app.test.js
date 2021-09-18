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
    it('should return all users', async () => {
      const { body: { users } } = await request.get('/api/users')
        .expect(200)
      expect(users).toBeInstanceOf(Array)
      expect(users.length).toBeGreaterThan(0)
      users.forEach((user) => {
        expect(user).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            bio: expect.any(String),
            avatar_url: expect.any(String),
            username: expect.any(String),
          })
        )
      })
    })
    it('paginated by default 10 results', async () => {
      const { body: { users, page, totalPages, totalResults } } 
        = await request.get('/api/users')
          .expect(200)
      expect(users).toHaveLength(10)
      expect(page).toBe(1)
      expect(totalPages).toBe(2)
      expect(totalResults).toBe(15)
    })
    it('page query', async () => {
      const { body: { users, page, totalPages, totalResults } } 
        = await request.get('/api/users?page=2')
          .expect(200)
      expect(users).toHaveLength(5)
      expect(page).toBe(2)
      expect(totalPages).toBe(2)
      expect(totalResults).toBe(15)
    })
    it('custom limit', async () => {
      const { body: { users, page, totalPages } } 
        = await request.get('/api/users?&limit=3')
          .expect(200)
      expect(users).toHaveLength(3)
      expect(page).toBe(1)
      expect(totalPages).toBe(5)
    })
    it('if limit is 0, do not paginate', async () => {
      const { body: { users, page, totalPages, totalDocs } } 
        = await request.get('/api/users?&limit=0')
          .expect(200)
      expect(users).toHaveLength(15)
      expect(page).toBe(1)
      expect(totalPages).toBe(1)
    })
    it('responds with 404 if no results on given page', async () => {
      const { body: { msg } } = await request
        .get('/api/users?page=200')
        .expect(404)
      expect(msg).toBe('Resource not found')
    })
    it('default sort is by user creation time descending', () => {
      // TEST HERE after doing post user
    })
  })
  describe('GET -/users/:user_id', () => {
    it('should return a user profile', async () => {
      const { body: { user } } = await request.get('/api/users/6143a704366e787fcfb34282')
      expect(user).toEqual(
        expect.objectContaining({
          _id: '6143a704366e787fcfb34282',
          bio: expect.any(String),
          avatar_url: expect.any(String),
          username: 'Shanna81'
        })
      )
    })
  })
  describe('POST - /signup', () => {
    it('should create a user', async () => {
      const testReq = { 
        username: 'sonic_hedgehog',
        name: 'Joe Warburton',
        avatar_url: 'http://img.url',
        password: 'pizza'
      }
      const { body: { user } } = await request
        .post('/api/signup')
        .expect(201)
        .send(testReq)
      expect(user).toEqual(
        expect.objectContaining({
          username: 'sonic_hedgehog',
          avatar_url: 'http://img.url',
          name: 'Joe Warburton',
        })
      )
    })
    it('should detect a taken username', async () => {
      const testReq = { 
        username: 'sonic_hedgehog',
        name: 'Joe Warburton',
        avatar_url: 'http://img.url',
        password: 'pizza'
      }
      await request
        .post('/api/signup')
        .expect(201)
        .send(testReq)
      const testReq2 = {
        username: 'sonic_hedgehog',
        name: 'JW',
        avatar_url: 'http://img2.url',
        password: 'calzone'
      }
      const { body: { msg } } = await request 
        .post('/api/signup')
        .expect(400)
        .send(testReq2)
      expect(msg).toBe('Username is taken')
    })
    it('missing fields on request, 400', async () => {
      const testReq = {
        username: 'sonic_hedgehog',
      }
      const { body: { msg } } = await request 
        .post('/api/signup')
        .expect(400)
        .send(testReq)
      expect(msg).toBe('Bad request')
    })
  })
  describe('POST - /login', () => {
    it('should log in a user with correct password', async () => {
      const testUser = { 
        username: 'logic1000',
        name: 'Susanne Kraft',
        avatar_url: 'http://img.url',
        password: 'octopus'
      }
      await request
        .post('/api/signup')
        .send(testUser)
        .expect(201)
      const testLogin = {
        username: 'logic1000',
        password: 'octopus',
      }
      const { body: { msg } } = await request
        .post('/api/login')
        .send(testLogin)
        .expect(200)
      expect(msg).toBe('Logged in')

    })
    it('should refuse login with incorrect password, 401 unauthorised', async () => {
      const testUser = { 
        username: 'logic1000',
        name: 'Susanne Kraft',
        avatar_url: 'http://img.url',
        password: 'octopus'
      }
      await request
        .post('/api/signup')
        .send(testUser)
      const testLogin = {
        username: 'logic1000',
        password: 'squid',
      }
      const { body: { msg } } = await request
        .post('/api/login')
        .send(testLogin)
        .expect(401)
      expect(msg).toBe('Incorrect password')
    })
    it('missing fields on request, 400', async () => {
      const testReq = {
        password: 'calzone'
      }
      const { body: { msg } } = await request 
        .post('/api/login')
        .expect(400)
        .send(testReq)
      expect(msg).toBe('Bad request')
    })
  })
})
describe('Route', () => {
  describe('GET - /routes', () => {
    it('should get all routes', async () => {
      const { body: { routes } } = await request.get('/api/routes')
        .expect(200)
      expect(routes).toBeInstanceOf(Array)
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
        )
      })    
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
    it('should query by user_id', async () => {
      const { body: { routes } } = await request
        .get('/api/routes?user_id=6143a704366e787fcfb34278')
        .expect(200)
      expect(routes).toBeInstanceOf(Array)
      expect(routes.length).toBeGreaterThan(0)
      routes.forEach((route) => {
        expect(route).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
            user_id: '6143a704366e787fcfb34278',
            coords: expect.any(Array),
            start_time_date: expect.any(String)
          })
        )
      }) 
    })
    it('paginated by default 5 results', async () => {
      const { body: { routes, page, totalPages, totalResults } } 
        = await request.get('/api/routes')
          .expect(200)
      expect(routes).toHaveLength(5)
      expect(page).toBe(1)
      expect(totalPages).toBe(4)
      expect(totalResults).toBe(20)
    })
    it('page query', async () => {
      const { body: { routes, page, totalPages, totalResults } } 
        = await request.get('/api/routes?page=2')
          .expect(200)
      expect(routes).toHaveLength(5)
      expect(page).toBe(2)
      expect(totalPages).toBe(4)
      expect(totalResults).toBe(20)
    })
    it('custom limit', async () => {
      const { body: { routes, page, totalPages } } 
        = await request.get('/api/routes?&limit=3')
          .expect(200)
      expect(routes).toHaveLength(3)
      expect(page).toBe(1)
      expect(totalPages).toBe(7)
    })
    it('responds with 404 if no results on given page', async () => {
      const { body: { msg } } = await request
        .get('/api/routes?page=200')
        .expect(404)
      expect(msg).toBe('Resource not found')
    })
    it('default sort is by route start time descending', async () => {
      const { body: { routes } } = await request.get('/api/routes')
        .expect(200)
      expect(routes).toBeSortedBy('start_time_date', {descending: true})
    })
    it('given order "asc", default sort is by route start time ascending', async () => {
      const { body: { routes } } = await request.get('/api/routes?order=asc')
        .expect(200)
      expect(routes).toBeSortedBy('start_time_date', {ascending: true})
    })
  })
  describe('GET -/routes/route_id', () => {
    it('should get a single route by its id', async () => {
      const { body: { route } } = await request
        .get('/api/routes/6143a704366e787fcfb34286')
        .expect(200)
      expect(route).toEqual(
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
      const testDate = new Date()
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
        start_time_date: testDate,
      }
      const { body: { route } } = await request
        .post('/api/routes')
        .send(testReq)
        .expect(201)
      expect(route).toEqual(
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
      const testReq = {
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
        start_time_date: new Date(),
      }
      const { body: { msg } } = await request
        .post('/api/routes')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request')
    })
    it('reject with 400 given a request with missing coordinates', async () => {
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        start_time_date: new Date(),
      }
      const { body: { msg } } = await request
        .post('/api/routes')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request')
    })
    it('reject with 400 given a request with missing user_id', async () => {
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        coords: parseStrava(testCoords),
        start_time_date: new Date(),
      }
      const { body: { msg } } = await request
        .post('/api/routes')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request')
    })
    it('reject with 400 given a request with missing start_time', async () => {
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
      }
      const { body: { msg } } = await request
        .post('/api/routes')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request')
    })
  })
})
describe('Poi', () => {
  describe('GET /routes/:route_id/poi', () => {
    it('should respond with relevant pois for a given route', async () => {
      const { body: { pois } } = await request.get('/api/routes/6143a704366e787fcfb34292/poi')
        .expect(200)
      expect(pois).toBeInstanceOf(Array)
      expect(pois.length).toBeGreaterThan(0)
      pois.forEach((poi) => {
        expect(poi).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            coords: expect.any(Object),
          })
        )
      })   
    })
  })
  describe('POST - /routes/:route_id/poi', () => {
    it('should post a point of interest', async () => {
      const testReq = {
        user_id: '6143a704366e787fcfb34278',
        photo: 'http://example.com',
        narration: 'what an interesting place!',
        coords: {"latitude":"53.5645390","longitude":"-1.4798400","time":"2019-01-22T18:33:09Z"}
      }
      const { body: { poi } } = await request
        .post('/api/routes/6143a704366e787fcfb34286/poi')
        .send(testReq)
        .expect(201)
      expect(poi).toEqual(
        expect.objectContaining({
          route_id: '6143a704366e787fcfb34286',
          _id: expect.any(String),
          photo: 'http://example.com',
          narration: 'what an interesting place!',
          user_id: '6143a704366e787fcfb34278',
          coords: expect.objectContaining({
            latitude: 53.5645390,
            longitude: -1.4798400,
            time: "2019-01-22T18:33:09.000Z"
          })
        })
      )
    })
    it('missing field, 400 bad request', async () => {
      const testReq = {
        user_id: '6143a704366e787fcfb34278',
        photo: 'http://example.com',
        narration: 'what an interesting place!',
      }
      const { body: { msg } } = await request
        .post('/api/routes/6143a704366e787fcfb34286/poi')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request')
    })
  })
})
describe('Comments', () => {
  describe('GET - /routes/:route_id/comments', () => {
    it.only('should respond with relevant comments for a given route', async () => {
      const { body: { comments } } = await request
        .get('/api/routes/6143a704366e787fcfb3428f/comments')
        .expect(200)
      expect(comments).toBeInstanceOf(Array)
      expect(comments.length).toBeGreaterThan(0)
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            route_id: '6143a704366e787fcfb3428f',
            user_id: '6143a704366e787fcfb34276',
            body: expect.any(String),
            created_at: expect.any(String)
          })
        )
      })   
    })
  })
  describe('POST - /routes/:route_id/comments', () => {
    it('should add a comment to a route', async () => {
      // const testDate = new Date()
      // const testReq = {
      //   title: 'My First Post',
      //   description: 'my first walk',
      //   user_id: '6143a704366e787fcfb34282',
      //   coords: parseStrava(testCoords),
      //   start_time_date: testDate,
      // }
      // const { body: { route } } = await request
      //   .post('/api/routes')
      //   .send(testReq)
      //   .expect(201)
      // expect(route).toEqual(
      //   expect.objectContaining({
      //     _id: expect.any(String),
      //     title: 'My First Post',
      //     description: 'my first walk',
      //     user_id: '6143a704366e787fcfb34282',
      //     coords: expect.any(Array),
      //     start_time_date: expect.any(String)
      // })
      // )
    })
  })
})