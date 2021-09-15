const { getAllUsers } = require('../models/userModels')

exports.getUsers = (req, res, next) => {
  console.log('controller')
  getAllUsers().then((users) => {
    res.status(200).send(users)
  })
}

exports.getUserByUsername = (req, res, next) => {}
