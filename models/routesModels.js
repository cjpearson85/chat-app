const { Router } = require('express')
const Route = require('../schemas/route')
const { route } = require('../app')

exports.selectAllRoutes = async () => {
  const result = await Route.find({})
  return result
}
