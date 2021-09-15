const { getAllRoutes } = require('../models/routesModels')

exports.getRoutes = (req, res, next) => {
  getAllRoutes.then((routes) => {
    res.status(200).send({ routes })
  })
}

exports.getRouteById = (req, res, next) => {}

exports.postRoute = (req, res, next) => {}

exports.deleteRoute = (req, res, next) => {}
