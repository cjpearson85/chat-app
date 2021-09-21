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
      const {
        body: { users },
      } = await request.get('/api/users').expect(200)
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
      const {
        body: { users, page, totalPages, totalResults },
      } = await request.get('/api/users').expect(200)
      expect(users).toHaveLength(10)
      expect(page).toBe(1)
      expect(totalPages).toBe(2)
      expect(totalResults).toBe(15)
    })
    it('page query', async () => {
      const {
        body: { users, page, totalPages, totalResults },
      } = await request.get('/api/users?page=2').expect(200)
      expect(users).toHaveLength(5)
      expect(page).toBe(2)
      expect(totalPages).toBe(2)
      expect(totalResults).toBe(15)
    })
    it('custom limit', async () => {
      const {
        body: { users, page, totalPages },
      } = await request.get('/api/users?&limit=3').expect(200)
      expect(users).toHaveLength(3)
      expect(page).toBe(1)
      expect(totalPages).toBe(5)
    })
    it('if limit is 0, do not paginate', async () => {
      const {
        body: { users, page, totalPages, totalDocs },
      } = await request.get('/api/users?&limit=0').expect(200)
      expect(users).toHaveLength(15)
      expect(page).toBe(1)
      expect(totalPages).toBe(1)
    })
    it('responds with 404 if no results on given page', async () => {
      const {
        body: { msg },
      } = await request.get('/api/users?page=200').expect(404)
      expect(msg).toBe('Resource not found')
    })
  })
  describe('GET -/users/:user_id', () => {
    it('should return a user profile', async () => {
      const {
        body: { user },
      } = await request.get('/api/users/6143a704366e787fcfb34282')
      expect(user).toEqual(
        expect.objectContaining({
          _id: '6143a704366e787fcfb34282',
          bio: expect.any(String),
          avatar_url: expect.any(String),
          username: 'Shanna81',
        })
      )
    })
  })
  describe('PATCH - /users/:user_id', () => {
    it('should update and return a user profile', async () => {
      const update = { bio: 'will this test bio update' }
      const result = await request
        .patch('/api/users/6143a704366e787fcfb34282')
        .send(update)
        .expect(200)
        .then((user) => {
          expect(user.body.user.bio).toEqual(update.bio)
        })
    })
    it('should update multiple characteristics and return a user profile', async () => {
      const update = {
        bio: 'will this test bio update with more than one thing',
        username: 'ant87',
      }
      const result = await request
        .patch('/api/users/6143a704366e787fcfb34282')
        .send(update)
        .expect(200)
        .then((user) => {
          expect(user.body.user.bio).toEqual(update.bio)
          expect(user.body.user.username).toEqual(update.username)
        })
    })
    it('patch password', async () => {
      const testReq = {
        username: 'sonic_hedgehog',
        name: 'Joe Warburton',
        avatar_url: 'http://img.url',
        password: 'pizza',
      }
      const {
        body: { user },
      } = await request.post('/api/signup').expect(201).send(testReq)
      const newPassword = { password: 'calzone' }
      await request
        .patch(`/api/users/${user._id}`)
        .send(newPassword)
        .expect(200)
      const testLogin = {
        username: 'sonic_hedgehog',
        password: newPassword.password,
      }
      const {
        body: { msg },
      } = await request.post('/api/login').send(testLogin).expect(200)
      expect(msg).toBe('Logged in')
      const oldLogin = {
        username: 'sonic_hedgehog',
        password: 'pizza',
      }
      const {
        body: { msg: msg2 },
      } = await request.post('/api/login').send(oldLogin).expect(401)
      expect(msg2).toBe('Incorrect password')
    })
    it('should detect a taken username', async () => {
      const testReq = {
        username: 'sonic_hedgehog',
        name: 'Joe Warburton',
        avatar_url: 'http://img.url',
        password: 'pizza',
      }
      const user = await request.post('/api/signup').expect(201).send(testReq)
      const testPatchReq = {
        username: 'sonic_hedgehog',
      }
      const {
        body: { msg },
      } = await request
        .patch(`/api/users/${user._id}`)
        .expect(400)
        .send(testPatchReq)
      expect(msg).toBe('Username is taken')
    })
    it('should respond with 400 if user does not exist', async () => {
      const update = { bio: 'will this test bio update' }
      const result = await request
        .patch('/api/users/ant')
        .send(update)
        .expect(400)
        .then((user) => {
          expect(user.body.msg).toEqual('Bad request')
        })
    })
  })
  describe('DELETE - /users/:user_id', () => {
    it('should delete user when passed a user_id', async () => {
      const result = await request
        .delete('/api/users/6143a704366e787fcfb34282')
        .expect(204)
    })
    it('should respond with 400 if user does not exist', async () => {
      const result = await request
        .delete('/api/users/ant')
        .expect(400)
        .then((user) => {
          expect(user.body.msg).toEqual('Bad request')
        })
    })
  })
  describe('POST - /signup', () => {
    it('should create a user', async () => {
      const testReq = {
        username: 'sonic_hedgehog',
        name: 'Joe Warburton',
        avatar_url: 'http://img.url',
        password: 'pizza',
      }
      const {
        body: { user },
      } = await request.post('/api/signup').expect(201).send(testReq)
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
        password: 'pizza',
      }
      await request.post('/api/signup').expect(201).send(testReq)
      const testReq2 = {
        username: 'sonic_hedgehog',
        name: 'JW',
        avatar_url: 'http://img2.url',
        password: 'calzone',
      }
      const {
        body: { msg },
      } = await request.post('/api/signup').expect(400).send(testReq2)
      expect(msg).toBe('Username is taken')
    })
    it('missing fields on request, 400', async () => {
      const testReq = {
        username: 'sonic_hedgehog',
      }
      const {
        body: { msg },
      } = await request.post('/api/signup').expect(400).send(testReq)
      expect(msg).toBe('Bad request')
    })
  })
  describe('POST - /login', () => {
    it('should log in a user with correct password', async () => {
      const testUser = {
        username: 'logic1000',
        name: 'Susanne Kraft',
        avatar_url: 'http://img.url',
        password: 'octopus',
      }
      await request.post('/api/signup').send(testUser).expect(201)
      const testLogin = {
        username: 'logic1000',
        password: 'octopus',
      }
      const {
        body: { msg },
      } = await request.post('/api/login').send(testLogin).expect(200)
      expect(msg).toBe('Logged in')
    })
    it('should refuse login with incorrect password, 401 unauthorised', async () => {
      const testUser = {
        username: 'logic1000',
        name: 'Susanne Kraft',
        avatar_url: 'http://img.url',
        password: 'octopus',
      }
      await request.post('/api/signup').send(testUser)
      const testLogin = {
        username: 'logic1000',
        password: 'squid',
      }
      const {
        body: { msg },
      } = await request.post('/api/login').send(testLogin).expect(401)
      expect(msg).toBe('Incorrect password')
    })
    it('missing fields on request, 400', async () => {
      const testReq = {
        password: 'calzone',
      }
      const {
        body: { msg },
      } = await request.post('/api/login').expect(400).send(testReq)
      expect(msg).toBe('Bad request')
    })
  })
  describe('GET - /users/:user_id/likes', () => {
    it('returns all likes by user', async () => {
      const likes = await request
        .get('/api/users/6143a704366e787fcfb34274/likes')
        .expect(200)
    })
  })
  describe('GET - /users/:user_id/following', () => {
    it('returns user IDs of all accounts followed by user in param', async () => {
      const {
        body: { following },
      } = await request
        .get('/api/users/6143a704366e787fcfb34280/following')
        .expect(200)
      expect(following).toBeInstanceOf(Array)
      expect(following.length).toBeGreaterThan(0)
      following.forEach((followedUser) => {
        expect(followedUser).toEqual(
          expect.objectContaining({
            followed_id: expect.any(String),
          })
        )
      })
    })
  })
  describe('GET - /users/:user_id/followers', () => {
    it('returns user IDs of all accounts who follow user in param', async () => {
      const {
        body: { followers },
      } = await request
        .get('/api/users/6143a704366e787fcfb34280/followers')
        .expect(200)
      expect(followers).toBeInstanceOf(Array)
      expect(followers.length).toBeGreaterThan(0)
      followers.forEach((follower) => {
        expect(follower).toEqual(
          expect.objectContaining({
            follower_id: expect.any(String),
          })
        )
      })
    })
  })
  describe('POST - /users/:user_id/following', () => {
    it('user in param follows user in request body', async () => {
      const testUserReq = {
        username: 'sonic_hedgehog',
        password: 'pizza',
      }
      const {
        body: { user: newUser },
      } = await request.post('/api/signup').expect(201).send(testUserReq)
      const {
        body: { follow },
      } = await request
        .post(`/api/users/${newUser._id}/following`)
        .send({ follow: '6143a704366e787fcfb34282' })
        .expect(201)
      expect(follow).toEqual(
        expect.objectContaining({
          follower_id: newUser._id,
          followed_id: '6143a704366e787fcfb34282',
        })
      )
    })
    it('rejects with 400 if user already followed', async () => {
      const testUserReq = {
        username: 'sonic_hedgehog',
        password: 'pizza',
      }
      const {
        body: { user: newUser },
      } = await request.post('/api/signup').expect(201).send(testUserReq)
      await request
        .post(`/api/users/${newUser._id}/following`)
        .send({ follow: '6143a704366e787fcfb34282' })
        .expect(201)
      const {
        body: { msg },
      } = await request
        .post(`/api/users/${newUser._id}/following`)
        .send({ follow: '6143a704366e787fcfb34282' })
        .expect(400)
      expect(msg).toBe('User already followed')
    })
  })
  describe('DELETE - /users/:user_id/following', () => {
    it('user in param unfollows user in request body', async () => {
      const testUserReq = {
        username: 'sonic_hedgehog',
        password: 'pizza',
      }
      const {
        body: { user: newUser },
      } = await request.post('/api/signup').expect(201).send(testUserReq)
      await request
        .post(`/api/users/${newUser._id}/following`)
        .send({ follow: '6143a704366e787fcfb34282' })
        .expect(201)
      const {
        body: { following },
      } = await request.get(`/api/users/${newUser._id}/following`).expect(200)
      expect(
        following
          .map((followed) => followed.followed_id)
          .includes('6143a704366e787fcfb34282')
      ).toBe(true)
      await request
        .delete(`/api/users/${newUser._id}/following`)
        .send({ follow: '6143a704366e787fcfb34282' })
        .expect(204)
      const {
        body: { following: updatedFollowing },
      } = await request.get(`/api/users/${newUser._id}/following`).expect(200)
      expect(
        updatedFollowing
          .map((followed) => followed.followed_id)
          .includes('6143a704366e787fcfb34282')
      ).toBe(false)
    })
    it('rejects with 400 if user not followed', async () => {
      const testUserReq = {
        username: 'sonic_hedgehog',
        password: 'pizza',
      }
      const {
        body: { user: newUser },
      } = await request.post('/api/signup').expect(201).send(testUserReq)
      const {
        body: { msg },
      } = await request
        .delete(`/api/users/${newUser._id}/following`)
        .send({ follow: '6143a704366e787fcfb34282' })
        .expect(400)
      expect(msg).toBe('User not followed')
    })
  })
})
describe('Route', () => {
  describe('GET - /routes', () => {
    it('should get all routes', async () => {
      const {
        body: { routes },
      } = await request.get('/api/routes').expect(200)
      expect(routes).toBeInstanceOf(Array)
      expect(routes.length).toBeGreaterThan(0)
      routes.forEach((route) => {
        expect(route).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
            user_id: expect.any(Object),
            coords: expect.any(Array),
            start_time_date: expect.any(String),
          })
        )
      })
    })
    it('a route should contain valid coords', async () => {
      const {
        body: { routes },
      } = await request.get('/api/routes').expect(200)
      routes[0].coords.forEach((coord) => {
        expect(coord).toEqual(
          expect.objectContaining({
            longitude: expect.any(String),
            latitude: expect.any(String),
            time: expect.any(String),
          })
        )
      })
    })
    it('should query by user_id', async () => {
      const {
        body: { routes },
      } = await request
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
            user_id: expect.objectContaining({
              _id: '6143a704366e787fcfb34278',
            }),
            coords: expect.any(Array),
            start_time_date: expect.any(String),
          })
        )
      })
    })
    it('paginated by default 5 results', async () => {
      const {
        body: { routes, page, totalPages, totalResults },
      } = await request.get('/api/routes').expect(200)
      expect(routes).toHaveLength(5)
      expect(page).toBe(1)
      expect(totalPages).toBe(4)
      expect(totalResults).toBe(20)
    })
    it('page query', async () => {
      const {
        body: { routes, page, totalPages, totalResults },
      } = await request.get('/api/routes?page=2').expect(200)
      expect(routes).toHaveLength(5)
      expect(page).toBe(2)
      expect(totalPages).toBe(4)
      expect(totalResults).toBe(20)
    })
    it('custom limit', async () => {
      const {
        body: { routes, page, totalPages },
      } = await request.get('/api/routes?&limit=3').expect(200)
      expect(routes).toHaveLength(3)
      expect(page).toBe(1)
      expect(totalPages).toBe(7)
    })
    it('responds with 404 if no results on given page', async () => {
      const {
        body: { msg },
      } = await request.get('/api/routes?page=200').expect(404)
      expect(msg).toBe('Resource not found')
    })
    it('default sort is by route start time descending', async () => {
      const {
        body: { routes },
      } = await request.get('/api/routes').expect(200)
      expect(routes).toBeSortedBy('start_time_date', { descending: true })
    })
    it('given order "asc", default sort is by route start time ascending', async () => {
      const {
        body: { routes },
      } = await request.get('/api/routes?order=asc').expect(200)
      expect(routes).toBeSortedBy('start_time_date', { ascending: true })
    })
  })
  describe('GET -/routes/route_id', () => {
    it('should get a single route by its id', async () => {
      const {
        body: { route },
      } = await request.get('/api/routes/6143a704366e787fcfb34286').expect(200)
      expect(route).toEqual(
        expect.objectContaining({
          _id: '6143a704366e787fcfb34286',
          title: 'aut aut praesentium',
          description:
            'Porro et ea perspiciatis quibusdam. Repellendus omnis sunt magnam ipsum.',
          coords: expect.any(Array),
          start_time_date: '2018-10-02T08:37:14.590Z',
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
      const {
        body: { route },
      } = await request.post('/api/routes').send(testReq).expect(201)
      expect(route).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          title: 'My First Post',
          description: 'my first walk',
          user_id: '6143a704366e787fcfb34282',
          coords: expect.any(Array),
          start_time_date: expect.any(String),
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
      const {
        body: { msg },
      } = await request.post('/api/routes').send(testReq).expect(400)
      expect(msg).toBe('Bad request')
    })
    it('reject with 400 given a request with missing coordinates', async () => {
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        start_time_date: new Date(),
      }
      const {
        body: { msg },
      } = await request.post('/api/routes').send(testReq).expect(400)
      expect(msg).toBe('Bad request')
    })
    it('reject with 400 given a request with missing user_id', async () => {
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        coords: parseStrava(testCoords),
        start_time_date: new Date(),
      }
      const {
        body: { msg },
      } = await request.post('/api/routes').send(testReq).expect(400)
      expect(msg).toBe('Bad request')
    })
    it('reject with 400 given a request with missing start_time', async () => {
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
      }
      const {
        body: { msg },
      } = await request.post('/api/routes').send(testReq).expect(400)
      expect(msg).toBe('Bad request')
    })
  })
  describe('PATCH - /routes/:routes_id', () => {
    it('should update a route with new info', async () => {
      const update = { title: 'My New Title' }
      const result = await request
        .patch('/api/routes/6143a704366e787fcfb34286')
        .send(update)
        .expect(200)
        .then((route) => {
          expect(route.body.route.title).toEqual(update.title)
        })
    })
    it('should respond with 400 if route does not exist', async () => {
      const update = { title: 'My New Title' }
      const result = await request
        .patch('/api/routes/antsRoute')
        .send(update)
        .expect(400)
        .then((user) => {
          expect(user.body.msg).toEqual('Bad request')
        })
    })
    it('should increment a routes likes', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request
        .post('/api/signup')
        .send({
          username: 'sonic_hedgehog',
          password: 'pizza',
        })
        .expect(201)
      const {
        body: {
          route: { likes: oldLikes },
        },
      } = await request.get('/api/routes/6143a704366e787fcfb34286').expect(200)
      const testReq = {
        likes: 1,
        user: _id,
      }
      const {
        body: {
          route: { likes: newLikes },
        },
      } = await request
        .patch('/api/routes/6143a704366e787fcfb34286')
        .send(testReq)
        .expect(200)
      expect(newLikes).toBe(oldLikes + 1)
    })
    it('should cancel a like', async () => {
      await request
        .patch(`/api/routes/6143a704366e787fcfb34286`)
        .send({ likes: 1, user: '6143a704366e787fcfb34274' })
        .expect(200)
      const {
        body: {
          likes: { routes },
        },
      } = await request
        .get('/api/users/6143a704366e787fcfb34274/likes')
        .expect(200)
      expect(
        routes
          .map((route) => route.route_id)
          .includes('6143a704366e787fcfb34286')
      ).toBe(true)
      await request
        .patch(`/api/routes/6143a704366e787fcfb34286`)
        .send({ likes: -1, user: '6143a704366e787fcfb34274' })
        .expect(200)
      const {
        body: {
          likes: { routes: updated },
        },
      } = await request
        .get('/api/users/6143a704366e787fcfb34274/likes')
        .expect(200)
      expect(
        updated
          .map((route) => route.route_id)
          .includes('6143a704366e787fcfb34286')
      ).toBe(false)
    })
    it('should reject with 400 duplicate like by same user', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request
        .post('/api/signup')
        .send({
          username: 'sonic_hedgehog',
          password: 'pizza',
        })
        .expect(201)
      const testReq = {
        likes: 1,
        user: _id,
      }
      await request
        .patch('/api/routes/6143a704366e787fcfb34286')
        .send(testReq)
        .expect(200)
      const {
        body: { msg },
      } = await request
        .patch('/api/routes/6143a704366e787fcfb34286')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request - duplicate like')
    })
    it('should reject with 400 if cancelling non-existent like', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request.post('/api/signup').send({
        username: 'sonic_hedgehog',
        password: 'pizza',
      })
      const {
        body: { msg },
      } = await request
        .patch('/api/routes/6143a704366e787fcfb34286')
        .send({ likes: -1, user: _id })
        .expect(400)
      expect(msg).toBe('Bad request - like not found')
    })
    it('reject 400, no user provided', async () => {
      const {
        body: { msg },
      } = await request
        .patch('/api/routes/6143a704366e787fcfb34286')
        .send({ likes: -1 })
        .expect(400)
      expect(msg).toBe('Bad request - missing field(s)')
    })
    it('should decrement likes', async () => {
      const testDate = new Date()
      const testReq = {
        title: 'My First Post',
        description: 'my first walk',
        user_id: '6143a704366e787fcfb34282',
        coords: parseStrava(testCoords),
        start_time_date: testDate,
      }
      const {
        body: { route: newRoute },
      } = await request.post('/api/routes').send(testReq).expect(201)
      const testReq2 = {
        likes: 1,
        user: '6143a704366e787fcfb34282',
      }
      const {
        body: {
          route: { likes: oldLikes },
        },
      } = await request
        .patch(`/api/routes/${newRoute._id}`)
        .send(testReq2)
        .expect(200)
      expect(oldLikes).toBe(1)
      const testReq3 = {
        likes: -1,
        user: '6143a704366e787fcfb34282',
      }
      const {
        body: {
          route: { likes: newLikes },
        },
      } = await request
        .patch(`/api/routes/${newRoute._id}`)
        .send(testReq3)
        .expect(200)
      expect(newLikes).toBe(0)
    })
  })
  describe('DELETE - /routes/:route_id', () => {
    it('should remove a route from the db when passed a route_id', async () => {
      const result = await request
        .delete('/api/routes/6143a704366e787fcfb34286')
        .expect(204)
    })
    it('should return a 404 if route does not exist', async () => {
      const result = await request
        .delete('/api/routes/ant')
        .expect(400)
        .then((user) => {
          expect(user.body.msg).toEqual('Bad request')
        })
    })
  })
})
describe('Poi', () => {
  describe('GET /routes/:route_id/poi', () => {
    it('should respond with relevant pois for a given route', async () => {
      const {
        body: { pois },
      } = await request
        .get('/api/routes/6143a704366e787fcfb34292/poi')
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
        coords: {
          latitude: '53.5645390',
          longitude: '-1.4798400',
          time: '2019-01-22T18:33:09Z',
        },
      }
      const {
        body: { poi },
      } = await request
        .post('/api/routes/6143a704366e787fcfb34286/poi')
        .send(testReq)
        .expect(201)
      expect(poi).toEqual(
        expect.objectContaining({
          route_id: '6143a704366e787fcfb34286',
          _id: expect.any(String),
          photo: expect.any(String),
          narration: 'what an interesting place!',
          user_id: '6143a704366e787fcfb34278',
          coords: expect.objectContaining({
            latitude: 53.564539,
            longitude: -1.47984,
            time: '2019-01-22T18:33:09.000Z',
          }),
        })
      )
    })
    it('missing field, 400 bad request', async () => {
      const testReq = {
        user_id: '6143a704366e787fcfb34278',
        photo: 'http://example.com',
        narration: 'what an interesting place!',
      }
      const {
        body: { msg },
      } = await request
        .post('/api/routes/6143a704366e787fcfb34286/poi')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request')
    })
  })
  describe('PATCH - /poi/:poi_id', () => {
    it('should update a POI', async () => {
      const {
        body: {
          poi: { photo },
        },
      } = await request
        .patch('/api/poi/6143a705366e787fcfb342f4')
        .send({ photo: 'http://newphoto' })
        .expect(200)
      expect(photo).toBe('http://newphoto')
    })
    it('should respond with 400 if poi does not exist', async () => {
      const update = { narration: 'My New Text' }
      const result = await request
        .patch('/api/poi/antsPoi')
        .send(update)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual('Bad request')
        })
    })
    it('should increment a POIs likes', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request
        .post('/api/signup')
        .send({
          username: 'sonic_hedgehog',
          password: 'pizza',
        })
        .expect(201)
      const {
        body: {
          poi: { likes: oldLikes },
        },
      } = await request
        .patch('/api/poi/6143a705366e787fcfb34303')
        .send({ narration: 'new body' })
        .expect(200)
      const {
        body: {
          poi: { likes: newLikes },
        },
      } = await request
        .patch('/api/poi/6143a705366e787fcfb34303')
        .send({ likes: 1, user: _id })
        .expect(200)
      expect(newLikes).toBe(oldLikes + 1)
    })
    it('should cancel a like', async () => {
      await request
        .patch(`/api/poi/6143a705366e787fcfb34303`)
        .send({ likes: 1, user: '6143a704366e787fcfb34274' })
        .expect(200)
      const {
        body: {
          likes: { pois },
        },
      } = await request
        .get('/api/users/6143a704366e787fcfb34274/likes?like_type=pois')
        .expect(200)
      expect(
        pois.map((poi) => poi.poi_id).includes('6143a705366e787fcfb34303')
      ).toBe(true)
      await request
        .patch(`/api/poi/6143a705366e787fcfb34303`)
        .send({ likes: -1, user: '6143a704366e787fcfb34274' })
        .expect(200)
      const {
        body: {
          likes: { pois: updated },
        },
      } = await request
        .get('/api/users/6143a704366e787fcfb34274/likes?like_type=pois')
        .expect(200)
      expect(
        updated.map((poi) => poi.poi_id).includes('6143a705366e787fcfb34303')
      ).toBe(false)
    })
    it('should reject with 400 duplicate like by same user', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request
        .post('/api/signup')
        .send({
          username: 'sonic_hedgehog',
          password: 'pizza',
        })
        .expect(201)
      const testReq = {
        likes: 1,
        user: _id,
      }
      await request
        .patch('/api/poi/6143a705366e787fcfb34303')
        .send(testReq)
        .expect(200)
      const {
        body: { msg },
      } = await request
        .patch('/api/poi/6143a705366e787fcfb34303')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request - duplicate like')
    })
    it('should reject with 400 if cancelling non-existent like', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request.post('/api/signup').send({
        username: 'sonic_hedgehog',
        password: 'pizza',
      })
      const {
        body: { msg },
      } = await request
        .patch('/api/poi/6143a705366e787fcfb34303')
        .send({ likes: -1, user: _id })
        .expect(400)
      expect(msg).toBe('Bad request - like not found')
    })
    it('reject 400, no user provided', async () => {
      const {
        body: { msg },
      } = await request
        .patch('/api/poi/6143a705366e787fcfb34303')
        .send({ likes: -1 })
        .expect(400)
      expect(msg).toBe('Bad request - missing field(s)')
    })
    it('should decrement likes', async () => {
      const testReq = {
        user_id: '6143a704366e787fcfb34278',
        narration: 'what an interesting place!',
        coords: {
          latitude: '53.5645390',
          longitude: '-1.4798400',
          time: '2019-01-22T18:33:09Z',
        },
      }
      const {
        body: { poi: newPoi },
      } = await request
        .post('/api/routes/6143a704366e787fcfb34287/poi')
        .send(testReq)
        .expect(201)
      const testReq2 = {
        likes: 1,
        user: '6143a704366e787fcfb34282',
      }
      const {
        body: {
          poi: { likes: oldLikes },
        },
      } = await request
        .patch(`/api/poi/${newPoi._id}`)
        .send(testReq2)
        .expect(200)
      expect(oldLikes).toBe(1)
      const testReq3 = {
        likes: -1,
        user: '6143a704366e787fcfb34282',
      }
      const {
        body: {
          poi: { likes: newLikes },
        },
      } = await request
        .patch(`/api/poi/${newPoi._id}`)
        .send(testReq3)
        .expect(200)
      expect(newLikes).toBe(0)
    })
  })
  describe('DELETE - /poi/:poi_id', () => {
    it('should delete a poi given as param', async () => {
      await request.delete('/api/poi/6143a705366e787fcfb342f5').expect(204)
    })
  })
})
describe('Comments', () => {
  describe('GET - /routes/:route_id/comments', () => {
    it('should respond with relevant comments for a given route', async () => {
      const {
        body: { comments },
      } = await request
        .get('/api/routes/6143a704366e787fcfb3428f/comments')
        .expect(200)
      expect(comments).toBeInstanceOf(Array)
      expect(comments.length).toBeGreaterThan(0)
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            route_id: '6143a704366e787fcfb3428f',
            user_id: expect.any(Object),
            body: expect.any(String),
            likes: expect.any(Number),
            createdAt: expect.any(String),
          })
        )
      })
    })
  })
  describe('POST - /routes/:route_id/comments', () => {
    it('should add a comment to a route', async () => {
      const testReq = {
        user_id: '6143a704366e787fcfb34276',
        body: 'here is what I think',
      }
      const {
        body: { comment },
      } = await request
        .post('/api/routes/6143a704366e787fcfb3428f/comments')
        .send(testReq)
        .expect(201)
      expect(comment).toEqual(
        expect.objectContaining({
          user_id: '6143a704366e787fcfb34276',
          body: 'here is what I think',
          likes: 0,
          createdAt: expect.any(String),
          route_id: '6143a704366e787fcfb3428f',
        })
      )
    })
    it.only('default sort is by createdAt descending', async () => {
      const {
        body: { comments },
      } = await request.get('/api/routes/6143a704366e787fcfb34285/comments').expect(200)
      console.log(comments)
      expect(comments).toBeSortedBy('createdAt', { descending: true })
    })
  })
  describe('PATCH - /comments/:comment_id', () => {
    it('should edit a comment body', async () => {
      const {
        body: {
          comment: { body: commentBody },
        },
      } = await request
        .patch('/api/comments/6143a705366e787fcfb342d8')
        .send({ body: 'I updated my comment!' })
        .expect(200)
      expect(commentBody).toBe('I updated my comment!')
    })
    it('should respond with 400 if comment does not exist', async () => {
      const update = { body: 'My New Text' }
      const result = await request
        .patch('/api/comments/antsComment')
        .send(update)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual('Bad request')
        })
    })
    it('should increment a comments likes', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request
        .post('/api/signup')
        .send({
          username: 'sonic_hedgehog',
          password: 'pizza',
        })
        .expect(201)
      const {
        body: {
          comment: { likes: oldLikes },
        },
      } = await request
        .patch('/api/comments/6143a705366e787fcfb342da')
        .send({ body: 'new body' })
        .expect(200)
      const {
        body: {
          comment: { likes: newLikes },
        },
      } = await request
        .patch('/api/comments/6143a705366e787fcfb342da')
        .send({ likes: 1, user: _id })
        .expect(200)
      expect(newLikes).toBe(oldLikes + 1)
    })
    it('should cancel a like', async () => {
      await request
        .patch(`/api/comments/6143a705366e787fcfb342da`)
        .send({ likes: 1, user: '6143a704366e787fcfb34274' })
        .expect(200)
      const {
        body: {
          likes: { comments },
        },
      } = await request
        .get('/api/users/6143a704366e787fcfb34274/likes?like_type=comments')
        .expect(200)
      expect(
        comments
          .map((comment) => comment.comment_id)
          .includes('6143a705366e787fcfb342da')
      ).toBe(true)
      await request
        .patch(`/api/comments/6143a705366e787fcfb342da`)
        .send({ likes: -1, user: '6143a704366e787fcfb34274' })
        .expect(200)
      const {
        body: {
          likes: { comments: updated },
        },
      } = await request
        .get('/api/users/6143a704366e787fcfb34274/likes')
        .expect(200)
      expect(
        updated
          .map((comment) => comment.comment_id)
          .includes('6143a705366e787fcfb342da')
      ).toBe(false)
    })
    it('should reject with 400 duplicate like by same user', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request
        .post('/api/signup')
        .send({
          username: 'sonic_hedgehog',
          password: 'pizza',
        })
        .expect(201)
      const testReq = {
        likes: 1,
        user: _id,
      }
      await request
        .patch('/api/comments/6143a705366e787fcfb342da')
        .send(testReq)
        .expect(200)
      const {
        body: { msg },
      } = await request
        .patch('/api/comments/6143a705366e787fcfb342da')
        .send(testReq)
        .expect(400)
      expect(msg).toBe('Bad request - duplicate like')
    })
    it('should reject with 400 if cancelling non-existent like', async () => {
      const {
        body: {
          user: { _id },
        },
      } = await request.post('/api/signup').send({
        username: 'sonic_hedgehog',
        password: 'pizza',
      })
      const {
        body: { msg },
      } = await request
        .patch('/api/comments/6143a705366e787fcfb342da')
        .send({ likes: -1, user: _id })
        .expect(400)
      expect(msg).toBe('Bad request - like not found')
    })
    it('reject 400, no user provided', async () => {
      const {
        body: { msg },
      } = await request
        .patch('/api/comments/6143a705366e787fcfb342da')
        .send({ likes: -1 })
        .expect(400)
      expect(msg).toBe('Bad request - missing field(s)')
    })
    it('should decrement likes', async () => {
      const testReq = {
        user_id: '6143a704366e787fcfb34276',
        body: 'here is what I think',
      }
      const {
        body: { comment: newComment },
      } = await request
        .post('/api/routes/6143a704366e787fcfb34287/comments')
        .send(testReq)
        .expect(201)
      const testReq2 = {
        likes: 1,
        user: '6143a704366e787fcfb34282',
      }
      const {
        body: {
          comment: { likes: oldLikes },
        },
      } = await request
        .patch(`/api/comments/${newComment._id}`)
        .send(testReq2)
        .expect(200)
      expect(oldLikes).toBe(1)
      const testReq3 = {
        likes: -1,
        user: '6143a704366e787fcfb34282',
      }
      const {
        body: {
          comment: { likes: newLikes },
        },
      } = await request
        .patch(`/api/comments/${newComment._id}`)
        .send(testReq3)
        .expect(200)
      expect(newLikes).toBe(0)
    })
  })
  describe('DELETE - /comments/:comment_id', () => {
    it('should delete a comment given as param', async () => {
      await request
        .delete('/api/comments/6143a705366e787fcfb342d5')
        .expect(204)
    })
  })
})
