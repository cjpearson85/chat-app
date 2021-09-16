const { selectAllRoutes } = require('../models/routesModels')

exports.getRoutes = (req, res, next) => {
  selectAllRoutes.then((routes) => {
    res.status(200).send({ routes })
  })
}

exports.getRouteById = (req, res, next) => {}

exports.postRoute = (req, res, next) => {}

exports.deleteRoute = (req, res, next) => {}

exports.getUserRoutes = (req, res, next) => {}

exports.patchRoute = (req, res, next) => {}
