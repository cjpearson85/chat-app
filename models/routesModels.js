const { Router } = require('express')

exports.getAllRoutes = () => {
  return Router.find().then((routes) => {
    return routes
  })
}
