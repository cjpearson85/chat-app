const faker = require('faker')
const fs = require('fs')
const crypto = require('crypto')

const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex')
}

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
}

const parseStrava = (data) => {
  return data.gpx.trk.trkseg.trkpt.map(pt => { 
    return {latitude: pt['-lat'], longitude: pt['-lon'], time: pt.time}
  })
}

let usersData = []
for (let i = 0; i < 22; i++) {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const name = firstName + ' ' + lastName 
  const avatar_url = faker.image.imageUrl()
  const username = firstName + lastName
  const salt = generateSalt()
  const hash = hashPassword(username, salt)
  const bio = faker.lorem.paragraph()
  const createdAt = faker.date.past(3)
  usersData.push({ name, avatar_url, username, bio, salt, hash, createdAt})
}

fs.writeFileSync('./db/data/dev-data/generated/users.seed.js', 'module.exports = ' + JSON.stringify(usersData))

const gpxs = []
for (let i = 0; i < 7; i++) {
  const gpx = require(`../data/gpx/gpx${i+1}`)
  gpxs.push(parseStrava(gpx))
}

let routesData = []
for (let i = 0; i < 40; i++) {
  const title = faker.lorem.words()
  const description = faker.lorem.sentences(2)
  const start_time_date = faker.date.past(3)
  const coords = gpxs[Math.floor(Math.random() * 6)]
  const likes = Math.floor(Math.random() * 20)
  routesData.push({ title, description, start_time_date, coords, likes })
}

fs.writeFileSync('./db/data/dev-data/generated/routes.seed.js', 'module.exports = ' + JSON.stringify(routesData))

let poiData = []
for (let i = 0; i < 250; i++) {
  let photo = Math.random() < 0.7 ? faker.image.nature() : null
  const narration = Math.random() < 0.7 ? faker.lorem.paragraph(): null
  if (!photo && !narration) {
    photo = faker.image.nature()
  }
  const createdAt = faker.date.past(3)
  const likes = Math.floor(Math.random() * 20)
  poiData.push({ photo, narration, createdAt, likes })
}

fs.writeFileSync('./db/data/dev-data/generated/pois.seed.js', 'module.exports = ' + JSON.stringify(poiData))

let commentData = []
for (let i = 0; i < 500; i++) {
  const body = faker.lorem.paragraph()
  const createdAt = faker.date.past(3)
  const likes = Math.floor(Math.random() * 20)
  commentData.push({ body, createdAt, likes })
}

fs.writeFileSync('./db/data/dev-data/generated/comments.seed.js', 'module.exports = ' + JSON.stringify(commentData))

