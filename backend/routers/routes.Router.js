const routesRouter = require('express').Router();
const {
  getRoute,
  postRoute,
  deleteRoute,
} = require('../controllers/routesController');

routesRouter
  .route('/')
  .get(getRoute) // get route info
  .post(postRoute) // post route to db
  .delete(deleteRoute); // delete route from db

module.exports = routesRouter;
