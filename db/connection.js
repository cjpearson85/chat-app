const mongoose = require('mongoose');
const ENV = process.env.NODE_ENV || 'development';
const devDb = require('../devDbUri')
const testDb = require('../testDbUri')

let db
if (ENV === "test") {
    db = mongoose.connect(testDb, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log('connected to test db') })
        .catch((err) => (console.log(err)))

} else {
    db = mongoose.connect(devDb, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log('connected to dev db') })
        .catch((err) => (console.log(err)))

}
module.exports = db;