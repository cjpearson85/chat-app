const commentsRouter = require('express').Router();
const {
  getComments,
  postComments,
  patchComments,
} = require('../controllers/commentsContoller');

commentsRouter.route('/:route_id/comments').get(getComments).post(postComments);

commentsRouter.route('/:comment_id').patch(patchComments);

module.exports = commentsRouter;
