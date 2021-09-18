const {
  selectUsers,
  selectUserById,
} = require('../models/userModels')

exports.getUsers = (req, res, next) => {
  selectUsers(req.query)
    .then((users) => {
      res.status(200).send(users)
    })
    .catch(next)
}

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params
  selectUserById(user_id)
    .then((user) => {
      res.status(200).send({ user })
  })
}
