const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Route = require('../../schemas/route')
const Comment = require('../../schemas/comment')
const Poi = require('../../schemas/poi')
const RouteLike = require('../../schemas/route-like')
const CommentLike = require('../../schemas/comment-like')
const Follow = require('../../schemas/follow')
const {
  commentsTestData, 
  routesTestData, 
  poisTestData, 
  usersTestData
} = require('../data/test-data/index')

const addIds = async (commentsTestData, routesTestData, poisTestData, usersTestData) => {
  const url = `mongodb://127.0.0.1/test`
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
  await connection.models.Poi.insertMany(poisWithRouteandCoords)
  
  if (connection.models.RouteLike !== undefined) {
    await connection.models.RouteLike.collection.drop()
  }

  let routeLikeCount = 0
  let routeLikeCombinations = []
  let routeLikesTestData = []
  while (routeLikeCount < 200) {
    const user = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    const route = insertedRoutes[Math.floor(Math.random() * (insertedRoutes.length - 1))]._id
    let combination = `${user}${route}`
    if (!routeLikeCombinations.includes(combination)) {
      routeLikeCombinations.push(combination)
      routeLikeCount++
      routeLikesTestData.push({route_id: route, user_id: user})
    }
  }

  await connection.models.RouteLike.insertMany(routeLikesTestData)

  if (connection.models.CommentLike !== undefined) {
    await connection.models.CommentLike.collection.drop()
  }

  let commentLikeCount = 0
  let commentLikeCombinations = []
  let commentLikesTestData = []
  while (commentLikeCount < 300) {
    const user = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    const comment = insertedComments[Math.floor(Math.random() * (insertedComments.length - 1))]._id
    let combination = `${user}${comment}`
    if (!commentLikeCombinations.includes(combination)) {
      commentLikeCombinations.push(combination)
      commentLikeCount++
      commentLikesTestData.push({comment_id: comment, user_id: user})
    }
  }

  await connection.models.CommentLike.insertMany(commentLikesTestData)

  if (connection.models.Follow !== undefined) {
    await connection.models.Follow.collection.drop()
  }

  let followCount = 0
  let followCombinations = []
  let followTestData = []
  while (followCount < 100) {
    const follower = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    const followed = insertedUsers[Math.floor(Math.random() * (insertedUsers.length - 1))]._id
    let followCombination = `${follower}${followed}`
    if (!commentLikeCombinations.includes(followCombination) && follower !== followed) {
      followCombinations.push(followCombination)
      followCount++
      followTestData.push({follower_id: follower, followed_id: followed})
    }
  }
  const insertedFollows = await connection.models.Follow.insertMany(followTestData)

  console.log(insertedFollows)


  await mongoose.connection.close()
}

addIds(commentsTestData, routesTestData, poisTestData, usersTestData)