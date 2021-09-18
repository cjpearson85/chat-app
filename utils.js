const crypto = require('crypto')

exports.parseStrava = (data) => {
  return data.gpx.trk.trkseg.trkpt.map((pt) => {
    return { latitude: pt['-lat'], longitude: pt['-lon'], time: pt.time }
  })
}

exports.generateSalt = () => {
  return crypto.randomBytes(16).toString('hex')
}

exports.hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`)
}

exports.validPassword = (password, hash, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`) === hash
}