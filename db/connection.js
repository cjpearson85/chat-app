const mongoose = require('mongoose')
const ENV = process.env.NODE_ENV || 'development'

let db
if (ENV === 'test') {
  db = mongoose
    .connect('mongodb://127.0.0.1/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
    })
    .catch((err) => console.log(err))
} else {
  db = mongoose
    .connect(process.env.MONGO_URI_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
    })
    .catch((err) => console.log(err))
}
module.exports = db
