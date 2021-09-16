const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const { setupDB } = require('../setup-tests')

describe('Name of the group', () => {
    it('should ', async () => {
        const res = await request.get('/api/users')
        expect(res.body).toEqual()
    });
});