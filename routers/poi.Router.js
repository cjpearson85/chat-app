const poiRouter = require('express').Router()
const {
  patchPoi,
  deletePoi,
  getUri
} = require('../controllers/poiController')


poiRouter
  .route('/')
  .get(getUri)
poiRouter
  .route('/:poi_id')
  .patch(patchPoi)
  .delete(deletePoi)


module.exports = poiRouter
