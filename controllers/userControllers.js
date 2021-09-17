const {
  selectAllUsers,
  selectUserByUsername,
} = require('../models/userModels')

exports.getUsers = (req, res, next) => {
  selectAllUsers().then((users) => {
    res.status(200).send({ users })
  }).catch(next)
}

exports.getUserByUsername = (req, res, next) => {
  console.log('controller')
  const { username } = req.params
  selectUserByUsername(username).then((user) => {
    res.status(200).send({ user })
  })
}
