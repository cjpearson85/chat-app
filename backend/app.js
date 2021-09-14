const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./schemas/user')
const devDb = require('./devDbUri')
const testDb = require('./testDbUri')

const app = express()
const ENV = process.env.NODE_ENV || 'development';

if (ENV === "test") {
    mongoose.connect(testDb, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log('connected to test db') })
        .catch((err) => (console.log(err)))

} else {
    mongoose.connect(devDb, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log('connected to dev db') })
        .catch((err) => (console.log(err)))

}

app.use(cors());
app.use(express.json());

app.get('/user', (req, res) => {
    const user = new User({
        firstName: 'Bob',
        surname: 'The builder',
        email: 'bobthebuilder@gmail.com',
        username: 'bobthebuilder'
    })
    user.save()
        .then((result) => res.send(result))
        .catch((err) => (console.log(err)))
})




module.exports = app;