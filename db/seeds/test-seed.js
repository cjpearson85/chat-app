const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Route = require('../../schemas/route')
const Comment = require('../../schemas/comment')
const Poi = require('../../schemas/poi')
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
    copy.coords.latitude = route.coords.latitude
    return copy
  })
  // const insertedPois = await connection.models.Poi.insertMany(poisWithRouteandCoords)
  // console.log(insertedPois)
  
  await mongoose.connection.close()
}

addIds(commentsTestData, routesTestData, poisTestData, usersTestData)