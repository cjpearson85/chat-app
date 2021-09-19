const {
  selectUsers,
  selectUserById,
  updateUserById,
  insertUser,
  login,
  removeUserById,
  selectLikes,
  selectFollowing,
  selectFollowers,
  insertFollow,
  removeFollow
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
    .catch(next)
}

exports.patchUserById = (req, res, next) => {
  const { user_id } = req.params
  updateUserById(user_id, req.body)
    .then((user) => {
      res.status(200).send({ user })
    })
    .catch(next)
}

exports.deleteUserById = (req, res, next) => {
  const { user_id } = req.params
  removeUserById(user_id)
    .then((user) => {
      res.status(204).send()
    })
    .catch(next)
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

exports.getLikes = (req, res, next) => {
  selectLikes(req.params, req.query)
    .then((likes) => {
      res.status(200).send({ likes })
    })
    .catch(next)
}

exports.getFollowing = (req, res, next) => {
  selectFollowing(req.params)
    .then((following) => {
      res.status(200).send({ following })
    })
    .catch(next)
}

exports.getFollowers = (req, res, next) => {
  selectFollowers(req.params)
    .then((followers) => {
      res.status(200).send({ followers })
    })
    .catch(next)
}

exports.postFollow = (req, res, next) => {
  insertFollow(req.params, req.body)
    .then((follow) => {
      res.status(200).send({ follow })
    })
    .catch(next)
}

exports.deleteFollow = (req, res, next) => {
  removeFollow(req.params, req.body)
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
}

