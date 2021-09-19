const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Route = require('../../schemas/route')
const Comment = require('../../schemas/comment')
const Poi = require('../../schemas/poi')
const RouteLike = require('../../schemas/route-like')
const PoiLike = require('../../schemas/poi-like')
const CommentLike = require('../../schemas/comment-like')
const Follow = require('../../schemas/follow')
const {
  commentsTestData, 
  routesTestData, 
  poisTestData, 
  usersTestData
} = require('../data/dev-data/generated/index')
const url = `mongodb://127.0.0.1/test`

const addIds = async (commentsTestData, routesTestData, poisTestData, usersTestData) => {
  const connection = await mongoose.connect(url)

  if (connection.models.User !== undefined) {
    await connection.models.User.collection.drop()
  }
  const insertedUsers = await connection.models.User.insertMany(usersTestData)

  if (connection.models.Route !== undefined) {
    await connection.models.Route.collection.drop()
  }

  const routesWithUser = routesTestData.map(route => {
    const copy = {...route}
    copy.user_id = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    return copy
  })
  const insertedRoutes = await connection.models.Route.insertMany(routesWithUser)

  if (connection.models.Comment !== undefined) {
    await connection.models.Comment.collection.drop()
  }
  const commentsWithUserAndRoute = commentsTestData.map(comment => {
    const copy = {...comment}
    copy.user_id = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    copy.route_id = insertedRoutes[Math.floor(Math.random() * (insertedRoutes.length - 1))]._id
    return copy
  })

  const insertedComments = await connection.models.Comment.insertMany(commentsWithUserAndRoute)
  
  if (connection.models.Poi !== undefined) {
    await connection.models.Poi.collection.drop()
  }

  const poisWithRouteandCoords = poisTestData.map(poi => {
    const copy = {...poi}
    const route = insertedRoutes[Math.floor(Math.random() * (insertedRoutes.length - 1))]
    copy.route_id = route._id
    const point = route.coords[Math.floor(Math.random() * (route.coords.length - 1))]
    copy.coords = { latitude: point.latitude, longitude: point.longitude, time: point.time }
    return copy
  })
  const insertedPois = await connection.models.Poi.insertMany(poisWithRouteandCoords)
  
  if (connection.models.RouteLike !== undefined) {
    await connection.models.RouteLike.collection.drop()
  }

  let routeLikesTestData = []
  for (let route of insertedRoutes) {
    let routeLikeCount = 0
    let users = []
    while (routeLikeCount < route.likes) {
      const user = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
      if (!users.includes(user)) {
        users.push(user)
        routeLikeCount++
        routeLikesTestData.push({ route_id: route._id, user_id: user })
      }
    }
  }


  await connection.models.RouteLike.insertMany(routeLikesTestData)

  if (connection.models.CommentLike !== undefined) {
    await connection.models.CommentLike.collection.drop()
  }

  let commentLikesTestData = []
  for (let comment of insertedComments) {
    let commentLikeCount = 0
    let users = []
    while (commentLikeCount < comment.likes) {
      const user = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
      if (!users.includes(user)) {
        users.push(user)
        commentLikeCount++
        commentLikesTestData.push({ comment_id: comment._id, user_id: user })
      }
    }
  }

  await connection.models.CommentLike.insertMany(commentLikesTestData)

  if (connection.models.PoiLike !== undefined) {
    await connection.models.PoiLike.collection.drop()
  }

  let poiLikesTestData = []
  for (let poi of insertedPois) {
    let poiLikeCount = 0
    let users = []
    while (poiLikeCount < poi.likes) {
      const user = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
      if (!users.includes(user)) {
        users.push(user)
        poiLikeCount++
        poiLikesTestData.push({ poi_id: poi._id, user_id: user })
      }
    }
  }

  await connection.models.CommentLike.insertMany(poiLikesTestData)

  if (connection.models.Follow !== undefined) {
    await connection.models.Follow.collection.drop()
  }

  let followCount = 0
  let followCombinations = []
  let followTestData = []
  while (followCount < 300) {
    const follower = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    const followed = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    let followCombination = `${follower}${followed}`
    if (!followCombinations.includes(followCombination) && follower !== followed) {
      followCombinations.push(followCombination)
      followCount++
      followTestData.push({follower_id: follower, followed_id: followed})
    }
  }
  await connection.models.Follow.insertMany(followTestData)

  await mongoose.connection.close()
}

const writeCollection = (collectionName) => {
  const getDocuments = function(db, callback) {
    db.collection(collectionName)
      .find({})
      .toArray(function(err, result) { 
        if (err) throw err 
        callback(result) 
      })
  }
  
  const MongoClient = require('mongodb').MongoClient
  const fs = require('fs')
  const dbName = 'test'
  const client = new MongoClient(url)
  
  client.connect(function(err) {
    console.log('Connected successfully to server')
    const db = client.db(dbName)
  
    getDocuments(db, function(docs) {
      
      console.log('Closing connection.')
      client.close()
          
      try {
        fs.writeFileSync(`db/data/dev-data/${collectionName}-output.json`, JSON.stringify(docs))
        console.log('Done writing to file.')
      }
      catch(err) {
        console.log('Error writing to file', err)
      }
    })
  })
}
const addIdsAndWrite = async () => {
  await addIds(commentsTestData, routesTestData, poisTestData, usersTestData)
  writeCollection('users')
  writeCollection('comments')
  writeCollection('pois')
  writeCollection('routelikes')
  writeCollection('commentlikes')
  writeCollection('follows')
  writeCollection('routes')
}

addIdsAndWrite()