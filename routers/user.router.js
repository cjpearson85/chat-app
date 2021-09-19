const userRouter = require('express').Router()
const {
  getUsers,
  getUserById,
  patchUserById,
  deleteUserById,
} = require('../controllers/userControllers')

userRouter.route('/').get(getUsers)
userRouter
  .route('/:user_id')
  .get(getUserById)
  .patch(patchUserById)
  .delete(deleteUserById)

module.exports = userRouter
