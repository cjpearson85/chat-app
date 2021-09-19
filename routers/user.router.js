const userRouter = require('express').Router()
const {
  getUsers,
  getUserById,
  patchUserById,
  deleteUserById,
  getLikes
} = require('../controllers/userControllers')

userRouter.route('/').get(getUsers)

userRouter
  .route('/:user_id')
  .get(getUserById)
  .patch(patchUserById)
  .delete(deleteUserById)

userRouter
  .route('/:user_id/likes')
  .get(getLikes)

module.exports = userRouter
