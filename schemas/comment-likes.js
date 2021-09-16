const mongoose = require('mongoose')
const Schema = mongoose.Schema

var commentLikesSchema = new mongoose.Schema(
  {
    comment_id: { type: Schema.Types.ObjectId, ref: 'Comment' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamp: true }
)

const Comments = mongoose.model('Comments', commentLikesSchema)
module.exports = Comments
