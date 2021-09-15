const apiRouter = require('express').Router()
const userRouter = require('./user.router')
const poiRouter = require('./poi.Router')
const routesRouter = require('./routes.Router')

apiRouter.use('/users', userRouter)
apiRouter.use('/poi', poiRouter)
apiRouter.use('/routes', routesRouter)

module.exports = apiRouter

//NON-MVP router/controllers/models
//user/likes
//follows
