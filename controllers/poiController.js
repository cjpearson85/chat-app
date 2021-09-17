const { selectPoisByRoute } = require('../models/poisModels')

exports.getPois = (req, res, next) => {
    console.log('in here')
    const { route_id } = req.params
    selectPoisByRoute(route_id)
      .then((pois) => {
        res.status(200).send({ pois })
      })
      .catch(next)
}

exports.patchPoi = (req, res, next) => {}

exports.deletePoi = (req, res, next) => {}
