const poiRouter = require('express').Router()
const {
  patchPoi,
  deletePoi,
  getUrl
} = require('../controllers/poiController')


poiRouter
  .route('/')
  .get(getUrl)
poiRouter
  .route('/:poi_id')
  .patch(patchPoi)
  .delete(deletePoi)


module.exports = poiRouter
