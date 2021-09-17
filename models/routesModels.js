const Route = require('../schemas/route')
const mongoose = require('mongoose')
const db = require('../db/connection')

exports.selectAllRoutes = async () => {
  const result = await Route.find({})
  return result
}

exports.insertRoute = async ({
  title,
  description,
  user_id,
  coords,
  start_time_date,
}) => {
  if (!coords) {
    return Promise.reject({status: 400, msg: 'Bad request'})
  }
  const route = new Route({
    title: title,
    description: description,
    user_id: user_id,
    coords: coords,
    start_time_date: start_time_date,
  })
  const result = await route.save()
  return result
}

exports.selectRouteById = async (id) => {

  const result = await Route.findOne({ _id: `${id}` })
  return result
}
