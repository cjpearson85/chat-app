const User = require('../schemas/user')

exports.getAllUsers = () => {
  return User.find().then((users) => {
    return users
  })
}
