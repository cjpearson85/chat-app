const userRouter = require('express').Router()
const {
  getUsers,
  getUserById,
  patchUserById,
} = require('../controllers/userControllers')

userRouter.route('/').get(getUsers)
userRouter.route('/:user_id').get(getUserById).patch(patchUserById)

module.exports = userRouter
