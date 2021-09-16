const poiRouter = require('express').Router()
const {
  getPois,
  patchPoi,
  deletePoi,
} = require('../controllers/poiController')

poiRouter
  .route('/')
  .get(getPois) //get all pois for given route
  .patch(patchPoi) //patch a poi
  .delete(deletePoi) //delete a poi

module.exports = poiRouter
