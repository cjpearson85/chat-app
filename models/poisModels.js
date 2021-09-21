const Poi = require('../schemas/poi')
const PoiLike = require('../schemas/poi-like')
const db = require('../db/connection')
const mongoose = require('mongoose')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")

exports.selectPoisByRoute = async (route_id) => {
  const result = await Poi.find({ route_id: `${route_id}` })
  return result
}

exports.insertPoi = async (
  user_id,
  imageLink,
  narration,
  coords,
  { route_id }
) => {
  if (!coords || !user_id || !route_id) {
    return Promise.reject({ status: 400, msg: 'Bad request' })
  }
  const poi = new Poi({
    user_id,
    route_id,
    coords,
    photo: imageLink || null,
    narration: narration || null,
  })
  const result = await poi.save()
  return result
}

exports.updatePoi = async ({ photo, narration, likes, user }, { poi_id }) => {
  if (!photo && !narration && !likes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - missing field(s)',
    })
  }
  if (likes && !user) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - missing field(s)',
    })
  }
  if (likes) {
    const existingLike = await PoiLike.findOne({ user_id: user, poi_id })
    if (existingLike) {
      if (likes === 1) {
        return Promise.reject({
          status: 400,
          msg: 'Bad request - duplicate like',
        })
      }
      if (likes === -1) {
        await PoiLike.deleteOne({ _id: existingLike._id })
      }
    } else {
      if (likes === -1) {
        return Promise.reject({
          status: 400,
          msg: 'Bad request - like not found',
        })
      }
      const poiLike = new PoiLike({
        user_id: user,
        poi_id,
      })
      await poiLike.save()
    }
  }

  const poiLikes = await Poi.findById(poi_id).select('likes')
  if (poiLikes.likes === 0 && likes === -1) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - likes are already zero',
    })
  }
  if (!likes) likes = poiLikes.likes
  else likes = poiLikes.likes + likes
  const result = await Poi.findByIdAndUpdate(
    poi_id,
    {
      photo,
      narration,
      likes,
    },
    { new: true }
  )
  return result
}

exports.removePoi = async ({ poi_id }) => {
  return Poi.findByIdAndDelete(poi_id)
}

exports.generateUrl = async () => {
  const client = new S3Client({ region: process.env.AWSREGION })
  const command = new GetObjectCommand({
    Bucket: process.env.AWSBUCKETNAME, 
    Key: process.env.AWSSECRETACCESSKEY,
    signatureVersion: 'v4',
    // ACL:'public-read'
  })
  const url = await getSignedUrl(client, command, { expiresIn: 3600 })
  return url
}