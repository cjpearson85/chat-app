const Route = require('../schemas/route')
const mongoose = require('mongoose')
const db = require('../db/connection')

exports.selectRoutes = async (queries) => {
  const {
    sort_by = 'start_time_date',
    order = 'desc',
    limit = 5,
    page = 1,
    user_id,
  } = queries

  if (
    !['start_time_date', 'likes'].includes(sort_by) ||
    !['asc', 'desc'].includes(order) ||
    !Number.isInteger(parseInt(limit)) ||
    !Number.isInteger(parseInt(page))
  ) {
    return Promise.reject({ status: 400, msg: 'Bad request - invalid sort' })
  }

  const query = user_id ? { user_id } : {}

  const result = await Route.paginate(query, {
    sort: (order === 'desc' ? '-' : '') + sort_by,
    offset: (page - 1) * limit,
    limit,
  })
  if (page > result.totalPages) {
    return Promise.reject({ status: 404, msg: 'Resource not found' })
  }
  return {
    routes: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    totalResults: result.totalDocs,
  }
}

exports.insertRoute = async ({
  title,
  description,
  user_id,
  coords,
  start_time_date,
}) => {
  if (!coords || !user_id || !title || !start_time_date) {
    return Promise.reject({ status: 400, msg: 'Bad request' })
  }
  const route = new Route({
    title,
    description,
    user_id,
    coords,
    start_time_date,
  })
  const result = await route.save()
  return result
}

exports.selectRouteById = async (id) => {
  const result = await Route.findOne({ _id: `${id}` })
  return result
}

exports.updateRouteById = async (id, body) => {
  const result = await Route.findByIdAndUpdate(id, body, { new: true })
  return result
}

exports.removeRouteById = async (id) => {
  const result = await Route.findByIdAndDelete(id)
  return result
}
