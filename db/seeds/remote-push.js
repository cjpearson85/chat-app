const mongoose = require('mongoose')
const devData = require('../data/dev-data/index')
const User = require('../../schemas/user')
const Route = require('../../schemas/route')
const Comment = require('../../schemas/comment')
const Poi = require('../../schemas/poi')
const RouteLike = require('../../schemas/route-like')
const CommentLike = require('../../schemas/comment-like')
const Follow = require('../../schemas/follow')

async function seedDB() {
  try {
    const connection = await mongoose.connect('')

    console.log('Connected correctly to server')

    if (connection.models.User !== undefined) {
      await connection.models.User.collection.drop()
    }
    await connection.models.User.insertMany(devData.users)
  
    if (connection.models.Route !== undefined) {
      await connection.models.Route.collection.drop()
    }
    await connection.models.Route.insertMany(devData.routes)
  
    if (connection.models.Comment !== undefined) {
      await connection.models.Comment.collection.drop()
    }
    await connection.models.Comment.insertMany(devData.comments)
    
    if (connection.models.Poi !== undefined) {
      await connection.models.Poi.collection.drop()
    }
    await connection.models.Poi.insertMany(devData.pois)
    
    if (connection.models.RouteLike !== undefined) {
      await connection.models.RouteLike.collection.drop()
    }
    await connection.models.RouteLike.insertMany(devData.routeLikes)
  
    if (connection.models.CommentLike !== undefined) {
      await connection.models.CommentLike.collection.drop()
    }
    await connection.models.CommentLike.insertMany(devData.commentLikes)
  
    if (connection.models.Follow !== undefined) {
      await connection.models.Follow.collection.drop()
    }
    await connection.models.Follow.insertMany(devData.follows)

    console.log('Database seeded! :)')
    mongoose.connection.close()
  } catch (err) {
    console.log(err.stack)
  }
}
seedDB()