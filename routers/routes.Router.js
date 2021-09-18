const routesRouter = require('express').Router()
const {
  postRoute,
  deleteRoute,
  getRoutes,
  getRouteById,
  getUserRoutes,
  patchRoute,
} = require('../controllers/routesController')
const {
  getPois,
  postPoi
} = require('../controllers/poiController')

routesRouter
  .route('/')
  .get(getRoutes) // get all routes
  .post(postRoute) // post route to db

routesRouter
  .route('/:route_id')
  .get(getRouteById) // get route by id
  .patch(patchRoute) // update a route
  .delete(deleteRoute) // delete route from db

routesRouter
  .route('/:route_id/poi')
  .get(getPois) // get route by id
  .post(postPoi)

// .patch(patchRoute) // update a route
// .delete(deleteRoute) // delete route from db

module.exports = routesRouter
