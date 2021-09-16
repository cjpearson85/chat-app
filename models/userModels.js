const User = require('../schemas/user')
const mongoose = require('mongoose')

exports.selectAllUsers = async () => {
  const result = await User.find({})
  return result
}

exports.selectUserByUsername = async (username) => {
  console.log('inside model')
  const result = await User.find({ username: `${username}` })
  return result
}
