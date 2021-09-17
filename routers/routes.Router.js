const routesRouter = require('express').Router()
const {
  postRoute,
  deleteRoute,
  getRoutes,
  getRouteById,
  getUserRoutes,
  patchRoute,
} = require('../controllers/routesController')

routesRouter
  .route('/')
  .get(getRoutes) // get all routes
  .post(postRoute) // post route to db

// routesRouter
//   .route('/:user_id')
//   .get(getUserRoutes) // get all routes for one user

routesRouter
  .route('/:route_id')
  .get(getRouteById) // get route by id
  .patch(patchRoute) // update a route
  .delete(deleteRoute) // delete route from db

module.exports = routesRouter
