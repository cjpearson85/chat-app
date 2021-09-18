const {
  selectPoisByRoute,
  insertPoi
} = require('../models/poisModels')

exports.getPois = (req, res, next) => {
  const { route_id } = req.params
  selectPoisByRoute(route_id)
    .then((pois) => {
      res.status(200).send({ pois })
    })
    .catch(next)
}

exports.postPoi = (req, res, next) => {
  insertPoi(req.body, req.params)
    .then((poi) => {
      res.status(201).send({ poi })
    })
    .catch(next)
}

exports.patchPoi = (req, res, next) => {}

exports.deletePoi = (req, res, next) => {}
