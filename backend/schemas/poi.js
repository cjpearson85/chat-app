const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const poiSchema = new Schema(
  {
    //route id(fk route id)
    //poi_id
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
);

const Poi = mongoose.model('Poi', userSchema);
module.exports = Poi;
