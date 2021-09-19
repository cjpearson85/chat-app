const poiRouter = require('express').Router()
const {
  patchPoi
} = require('../controllers/poiController')

poiRouter
  .route('/:poi_id')
  .patch(patchPoi)

module.exports = poiRouter
