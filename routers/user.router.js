const userRouter = require('express').Router()
const {
  getUsers,
  getUserById,
} = require('../controllers/userControllers')

userRouter.route('/').get(getUsers)
userRouter.route('/:user_id').get(getUserById)

module.exports = userRouter
