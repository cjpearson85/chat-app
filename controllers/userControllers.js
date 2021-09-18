const {
  selectUsers,
  selectUserByUsername,
} = require('../models/userModels')

exports.getUsers = (req, res, next) => {
  selectUsers(req.query)
    .then((users) => {
      res.status(200).send(users)
    })
    .catch(next)
}

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params
  selectUserByUsername(username).then((user) => {
    res.status(200).send({ user })
  })
}
