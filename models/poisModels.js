const Poi = require('../schemas/poi')
const db = require('../db/connection')
const mongoose = require('mongoose')

exports.selectPoisByRoute = async (route_id) => {
    const result = await Poi.find({ route_id: `${route_id}` })
    return result
  }