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
      lat: { type: 'integer', required: true },
      long: { type: 'integer', required: true },
      alt: { type: 'integer', required: true },
      time: { type: 'integer', required: true },
    },
  },
  { timestamps: true }
)

const poi = mongoose.model('Poi', poiSchema)
module.exports = poi
