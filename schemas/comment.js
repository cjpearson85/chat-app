const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')

var commentSchema = new mongoose.Schema(
  {
    route_id: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: {
      type: 'string',
      required: true,
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

commentSchema.plugin(mongoosePaginate)

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
