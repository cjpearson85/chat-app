const {
  selectAllRoutes,
  insertRoute,
  selectRouteById,
} = require('../models/routesModels')

exports.getRoutes = (req, res, next) => {
  selectAllRoutes().then((routes) => {
    res.status(200).send({ routes })
  }).catch(next)
}

exports.getRouteById = (req, res, next) => {
  console.log('in here controller')
  const { route_id } = req.params
  selectRouteById(route_id)
    .then((route) => {
      res.status(200).send({ route })
    })
    .catch(next)
}

exports.postRoute = (req, res, next) => {
  insertRoute(req.body)
    .then((route) => {
      res.status(201).send({ route })
    })
    .catch(next)
}

exports.deleteRoute = (req, res, next) => {}

exports.getUserRoutes = (req, res, next) => {}

exports.patchRoute = (req, res, next) => {}
