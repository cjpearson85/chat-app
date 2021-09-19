const poiRouter = require('express').Router()
const {
  patchPoi,
  deletePoi
} = require('../controllers/poiController')

poiRouter
  .route('/:poi_id')
  .patch(patchPoi)
  .delete(deletePoi)

module.exports = poiRouter
