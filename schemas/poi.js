const mongoose = require('mongoose')
const Schema = mongoose.Schema

const poiSchema = new Schema(
  {
    route_id: { type: Schema.Types.ObjectId, ref: 'Route' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    photo: {
      type: 'string',
      required: false,
      maxLength: 200,
    },
    narration: {
      type: 'string',
      required: false,
      maxLength: 500,
    },
    coords: {
      latitude: { type: 'Number', required: true },
      longitude: { type: 'Number', required: true },
      time: {type: 'Date'}
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const Poi = mongoose.model('Poi', poiSchema)
module.exports = Poi
