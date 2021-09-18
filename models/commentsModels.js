const Comment = require('../schemas/comment')
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
      limit
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
