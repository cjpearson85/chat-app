const mongoose = require('mongoose')
const Schema = mongoose.Schema

var routeLikeSchema = new mongoose.Schema(
  {
    route_id: { type: Schema.Types.ObjectId, ref: 'Route' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const RouteLike = mongoose.model('RouteLike', routeLikeSchema)
module.exports = RouteLike
