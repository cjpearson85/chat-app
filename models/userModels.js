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
  return {
    users: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    totalResults: result.totalDocs
  }
}

exports.selectUserByUsername = async (username) => {
  const result = await User.find({ username: `${username}` })
  let returnUser = {
    user_id: result[0]._id,
    name: result[0].name,
    bio: result[0].bio,
    avatar_url: result[0].avatar_url,
    username: result[0].username,
  }
  return returnUser
}
