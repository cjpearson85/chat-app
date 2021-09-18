const apiRouter = require('express').Router()
const userRouter = require('./user.router')
const routesRouter = require('./routes.Router')
const {
  postUser,
  postLogin
} = require('../controllers/userControllers')

apiRouter.use('/users', userRouter)
apiRouter.use('/routes', routesRouter)

apiRouter.route('/signup')
  .post(postUser)
apiRouter.route('/login')
  .post(postLogin)

module.exports = apiRouter