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
    return {latitude: pt['-lat'], longitude: pt['-lon']}
  })
}

let usersData = []
for (let i = 0; i < 15; i++) {
  const name = faker.name.firstName() + ' ' + faker.name.lastName() 
  const avatar_url = faker.image.imageUrl()
  const username = faker.internet.userName()
  const salt = generateSalt()
  const hash = hashPassword(username, salt)
  usersData.push({ name, avatar_url, username, salt, hash})
}

fs.writeFileSync('./db/data/test-data/users.seed.js', 'module.exports = ' + JSON.stringify(usersData))

const gpxs = []
for (let i = 0; i < 7; i++) {
  const gpx = require(`../data/test-data/gpx/gpx${i+1}`)
  gpxs.push(parseStrava(gpx))
}

let routesData = []
for (let i = 0; i < 20; i++) {
  const title = faker.lorem.words()
  const description = faker.lorem.paragraph()
  const start_time_date = faker.date.past(3)
  const coords = gpxs[Math.floor(Math.random() * 6)]
  routesData.push({ title, description, start_time_date, coords})
}

fs.writeFileSync('./db/data/test-data/routes.seed.js', 'module.exports = ' + JSON.stringify(routesData))

let poiData = []
for (let i = 0; i < 80; i++) {
  const photo = Math.random() > 0.7 ? faker.image.nature() : null
  const narration = Math.random() > 0.7 ? faker.lorem.paragraph(): null
  poiData.push({ photo, narration})
}

fs.writeFileSync('./db/data/test-data/pois.seed.js', 'module.exports = ' + JSON.stringify(poiData))

let commentData = []
for (let i = 0; i < 80; i++) {
  const body = faker.lorem.paragraph()
  commentData.push({ body})
}

fs.writeFileSync('./db/data/test-data/comments.seed.js', 'module.exports = ' + JSON.stringify(commentData))

