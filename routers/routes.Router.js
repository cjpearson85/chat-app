const routesRouter = require('express').Router()
const {
  postRoute,
  deleteRoute,
  getRoutes,
  getRouteById,
} = require('../controllers/routesController')

routesRouter
  .route('/')
  .get(getRoutes) // get all routes
  .post(postRoute) // post route to db
  .delete(deleteRoute) // delete route from db

routesRouter.route('/:route_id').get(getRouteById) // get route info

module.exports = routesRouter
