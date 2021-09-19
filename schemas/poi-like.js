const mongoose = require('mongoose')
const Schema = mongoose.Schema

var poiLikeSchema = new mongoose.Schema(
  {
    poi_id: { type: Schema.Types.ObjectId, ref: 'Poi', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamp: true }
)

const PoiLike = mongoose.model('PoiLike', poiLikeSchema)
module.exports = PoiLike
