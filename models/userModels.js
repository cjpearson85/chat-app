const User = require('../schemas/user')
const mongoose = require('mongoose')
const db = require('../db/connection')

exports.selectUsers = async (queries) => {
  const {
    limit = 10,
    page = 1,
  } = queries

  if (!Number.isInteger(parseInt(limit)) ||
      !Number.isInteger(parseInt(page))) {
    return Promise.reject({status: 400, msg: 'Bad request - invalid sort'})
  }

  const result = await User.paginate(
    {},
    {
      sort: {created_at: -1},
      offset: (page - 1) * limit,
      limit,
      select: ['user_id', 'name', 'bio', 'avatar_url', 'username']
    }  
  )
  if (page > result.totalPages) {
    return Promise.reject({status: 404, msg: 'Resource not found'})
  }
  return {
    users: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    totalResults: result.totalDocs
  }
}

exports.selectUserById = async (user_id) => {
  const result = await User.findOne(
    { _id: user_id })
    .select('user_id name bio avatar_url username')
  return result
}
