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
      maxLength: 300,
    },
    coords: {
      latitude: { type: 'Number', required: true },
      longitude: { type: 'Number', required: true },
    },
  },
  { timestamps: true }
)

const Poi = mongoose.model('Poi', poiSchema)
module.exports = Poi
