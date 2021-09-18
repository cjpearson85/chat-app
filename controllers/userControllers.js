const {
  selectUsers,
  selectUserById,
  updateUserById,
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
  selectUserById(user_id).then((user) => {
    res.status(200).send({ user })
  })
}

exports.patchUserById = (req, res, next) => {
  const { user_id } = req.params
  const { body } = req
  updateUserById(user_id, body).then((user) => {
    res.status(200).send({ user })
  })
}
