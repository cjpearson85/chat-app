const Poi = require('../schemas/poi')
const db = require('../db/connection')
const mongoose = require('mongoose')

exports.selectPoisByRoute = async (route_id) => {
  const result = await Poi.find({ route_id: `${route_id}` })
  return result
}

exports.insertPoi = async (body, { route_id }) => {
  const {
    user_id,
    photo,
    narration,
    coords
  } = body

  if (!coords || !user_id || !route_id) {
    return Promise.reject({status: 400, msg: 'Bad request'})
  }
  const poi = new Poi({
    user_id,
    route_id,
    coords,
    photo: photo || null,
    narration: narration || null,
  })
  const result = await poi.save()
  return result
}

exports.updatePoi = async (reqBody, { poi_id }) => {
  
}

exports.removePoi = async ({ poi_id }) => {

}