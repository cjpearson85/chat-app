const {
  selectRoutes,
  insertRoute,
  selectRouteById,
  updateRouteById,
  removeRouteById,
} = require('../models/routesModels')

exports.getRoutes = (req, res, next) => {
  selectRoutes(req.query)
    .then((routes) => {
      res.status(200).send(routes)
    })
    .catch(next)
}

exports.getRouteById = (req, res, next) => {
  const { route_id } = req.params
  selectRouteById(route_id)
    .then((route) => {
      if (route === null) {
        res.status(404).send({ msg: 'Not Found' })
      } else {
        res.status(200).send({ route })
      }
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

exports.deleteRoute = (req, res, next) => {
  const { route_id } = req.params
  removeRouteById(route_id)
    .then((route) => {
      res.status(204).send()
    })
    .catch(next)
}

exports.patchRoute = (req, res, next) => {
  const { route_id } = req.params
  updateRouteById(route_id, req.body)
    .then((route) => {
      res.status(200).send({ route })
    })
    .catch(next)
}
