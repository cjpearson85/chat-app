const {
  selectUsers,
  selectUserById,
  updateUserById,
  insertUser,
  login,
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

exports.postUser = (req, res, next) => {
  insertUser(req.body)
    .then((user) => {
      res.status(201).send({ user })
    })
    .catch(next)
}

exports.postLogin = (req, res, next) => {
  login(req.body)
    .then((msg) => {
      res.status(200).send(msg)
    })
    .catch(next)
}
