const commentsRouter = require('express').Router()
const {
  patchComment,
  getComment
} = require('../controllers/commentsContoller')

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)

module.exports = commentsRouter
