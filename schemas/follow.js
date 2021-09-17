const mongoose = require('mongoose')
const Schema = mongoose.Schema

var followSchema = new mongoose.Schema(
  {
    follower_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    followed_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamp: true }
)

const Follow = mongoose.model('Follow', followSchema)
module.exports = Follow
