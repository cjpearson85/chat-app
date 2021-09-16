const mongoose = require('mongoose')
const Schema = mongoose.Schema

var routeLikesSchema = new mongoose.Schema(
  {
    route_id: { type: Schema.Types.ObjectId, ref: 'Route' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamp: true }
)

const Comments = mongoose.model('Comments', routeLikesSchema)
module.exports = Comments
