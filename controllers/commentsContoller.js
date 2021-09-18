const {
  selectComments,
  insertComment
} = require('../models/commentsModels')

exports.getComments = (req, res, next) => {
  selectComments(req.query, req.params)
    .then((comments) => {
      res.status(200)
        .send(comments)
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
  insertComment(req.body, req.params)
    .then((comment) => {
      res.status(201).send({ comment })
    })
    .catch(next)
}

exports.patchComment = (req, res, next) => {}
