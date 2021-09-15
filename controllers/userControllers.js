const { getAllUsers } = require('../models/userModels');

exports.getUsers = (req, res, next) => {
  getAllUsers.then((users) => {
    res.status(200).send(users);
  });
};

exports.getUserByUsername = (req, res, next) => {};
