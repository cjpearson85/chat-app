const Comment = require('../schemas/comment')
const CommentLike = require('../schemas/comment-like')
const db = require('../db/connection')
const mongoose = require('mongoose')

exports.selectComments = async (queries, { route_id }) => {
  const {
    sort_by = 'created_at',
    order = 'desc',
    limit = 15,
    page = 1,
  } = queries

  if (!['created_at', 'likes']
    .includes(sort_by) || 
        !['asc', 'desc'].includes(order) ||
        !Number.isInteger(parseInt(limit)) ||
        !Number.isInteger(parseInt(page))) {
    return Promise.reject({status: 400, msg: 'Bad request - invalid sort'})
  }
  const result = await Comment.paginate(
    { route_id },
    {
      sort: (order === 'desc' ? '-' : '') + sort_by,
      offset: (page - 1) * limit,
      limit,
      populate: 'user_id'
    }
  )
  if (page > result.totalPages) {
    return Promise.reject({status: 404, msg: 'Resource not found'})
  }
  return {
    comments: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    totalResults: result.totalDocs
  }
}

exports.insertComment = async ({ body, user_id }, { route_id }) => {
  if (!body || !user_id) {
    return Promise.reject({status: 400, msg: 'Bad request'})
  }
  const comment = new Comment({
    body,
    route_id,
    user_id
  })
  const result = await comment.save()
  return result
}

exports.updateComment = async ({ body, likes, user }, { comment_id }) => {
  if (!body && !likes) {
    return Promise.reject({ status: 400, msg: 'Bad request - missing field(s)' })
  }
  if (likes && !user) {
    return Promise.reject({ status: 400, msg: 'Bad request - missing field(s)' })
  }
  if (likes) {
    const existingLike = await CommentLike.findOne({user_id: user, comment_id})
    if (existingLike) {
      if (likes === 1) {
        return Promise.reject({ status: 400, msg: 'Bad request - duplicate like' })
      }
      if (likes === -1) {
        await CommentLike.deleteOne({_id: existingLike._id})
      }
    } else {
      if (likes === -1) {
        return Promise.reject({ status: 400, msg: 'Bad request - like not found' })
      }
      const commentLike = new CommentLike ({
        user_id: user,
        comment_id,
      })
      await commentLike.save()
    }
  }

  const commentLikes = await Comment.findById(comment_id).select('likes')
  if (commentLikes.likes === 0 && likes === -1) {
    return Promise.reject({ status: 400, msg: 'Bad request - likes are already zero' })
  }
  if (!likes) likes = commentLikes.likes
  else likes = commentLikes.likes + likes
  const result = await Comment.findByIdAndUpdate(comment_id, {
    body,
    likes
  }, { new: true })
  return result
}


exports.removeComment = async ({ comment_id }) => {
  return Comment.findByIdAndDelete(comment_id)
}