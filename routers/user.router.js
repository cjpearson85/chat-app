const userRouter = require('express').Router()
const {
  getUsers,
  getUserById,
  patchUserById,
  deleteUserById,
  getLikes,
  getFollowing,
  getFollowers,
  postFollow,
  deleteFollow
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

userRouter
  .route('/:user_id/following')
  .get(getFollowing)
  .post(postFollow)
  .delete(deleteFollow)

userRouter
  .route('/:user_id/followers')
  .get(getFollowers)

module.exports = userRouter
