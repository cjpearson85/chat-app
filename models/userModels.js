const User = require('../schemas/user')
const mongoose = require('mongoose')
const db = require('../db/connection')

exports.selectAllUsers = async () => {
  const result = await User.find({})
  let returnResult = result.map((user) => {
    let returnUser = {
      user_id: user._id,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatar_url,
      username: user.username,
    }
    return returnUser
  })
  return returnResult
}

exports.selectUserByUsername = async (username) => {
  console.log('inside model')
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
