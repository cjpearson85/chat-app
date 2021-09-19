const User = require('../schemas/user')
const RouteLike = require('../schemas/route-like')
const CommentLike = require('../schemas/comment-like')
const PoiLike = require('../schemas/poi-like')
const mongoose = require('mongoose')
const db = require('../db/connection')
const { generateSalt, hashPassword, validPassword } = require('../utils')

exports.selectUsers = async (queries) => {
  const { limit = 10, page = 1 } = queries

  if (!Number.isInteger(parseInt(limit)) || !Number.isInteger(parseInt(page))) {
    return Promise.reject({ status: 400, msg: 'Bad request - invalid sort' })
  }
  let result
  if (limit === '0') {
    result = await User.paginate(
      {},
      {
        sort: { createdAt: -1 },
        pagination: false,
        select: ['user_id', 'name', 'bio', 'avatar_url', 'username'],
      }
    )
    return {
      users: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      totalResults: result.totalDocs,
    }
  } else {
    const result = await User.paginate(
      {},
      {
        sort: { createdAt: -1 },
        offset: (page - 1) * limit,
        limit,
        select: ['user_id', 'name', 'bio', 'avatar_url', 'username'],
      }
    )
    if (page > result.totalPages) {
      return Promise.reject({ status: 404, msg: 'Resource not found' })
    }
    return {
      users: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      totalResults: result.totalDocs,
    }
  }
}

exports.selectUserById = async (user_id) => {
  const result = await User.findOne({ _id: user_id }).select(
    'user_id name bio avatar_url username'
  )
  return result
}

exports.updateUserById = async (user_id, update) => {
  const {
    username,
    password,
    avatar_url,
    bio
  } = update

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return Promise.reject({ status: 400, msg: 'Username is taken' })
  }
  let salt, hash
  if (password) {
    salt = generateSalt()
    hash = hashPassword(password, salt)
  }

  const result = await User.findByIdAndUpdate(user_id, {
    username,
    avatar_url,
    bio,
    hash,
    salt
  }, {
    new: true,
  }).select('user_id name bio avatar_url username')
  return result
}

exports.removeUserById = async (user_id) => {
  const result = await User.findByIdAndDelete(user_id)
  return result
}

exports.insertUser = async ({ username, name, bio, avatar_url, password }) => {
  if (!username || !password) {
    return Promise.reject({ status: 400, msg: 'Bad request' })
  }
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return Promise.reject({ status: 400, msg: 'Username is taken' })
  }

  const salt = generateSalt()

  const user = new User({
    username,
    name,
    bio,
    avatar_url,
    salt,
    hash: hashPassword(password, salt),
  })
  const result = await user.save()
  return result
}

exports.login = async ({ username, password }) => {
  if (!username || !password) {
    return Promise.reject({ status: 400, msg: 'Bad request' })
  }
  const userDetails = await User.findOne({ username }).select('hash salt')
  if (!userDetails) {
    return Promise.reject({ status: 400, msg: 'Username not found' })
  }
  if (!validPassword(password, userDetails.hash, userDetails.salt)) {
    return Promise.reject({ status: 401, msg: 'Incorrect password' })
  } else {
    return { msg: 'Logged in' }
  }
}

exports.selectLikes = async ({ user_id }, { like_type }) => {
  if (like_type) {
    if (!['comments', 'routes', 'pois'].includes(like_type)) {
      return Promise.reject({ status: 400, msg: 'Bad request' })
    }
  }
  if (like_type === 'comments') {
    return { comments: await CommentLike.find({ user_id }) }
  }
  if (like_type === 'routes') {
    return { routes: await RouteLike.find({ user_id }) }
  }
  if (like_type === 'pois') {
    return { pois: await PoiLike.find({ user_id }) }
  }
  if (!like_type) {
    const [comments, routes, pois] = await Promise.all([
      CommentLike.find({ user_id }),
      RouteLike.find({ user_id }),
      PoiLike.find({ user_id })
    ])
    return { 
      comments,
      routes, 
      pois
    }
  }
}