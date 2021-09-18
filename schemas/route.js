const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')

const routeSchema = new Schema(
  {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: false,
      maxLength: 350,
    },
    likes: {
      type: Number,
      default: 0
    },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    coords: { type: 'array', required: true },
    start_time_date: { type: 'date', required: true },
  },
  { timestamps: true }
)

routeSchema.plugin(mongoosePaginate)

const Route = mongoose.model('Route', routeSchema)
module.exports = Route
