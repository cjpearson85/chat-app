const express = require('express')
const cors = require('cors')
const User = require('./schemas/user')
const apiRouter = require('./routers/api.router')
const app = express()
const mongoose = require('mongoose')
// const db = require('./db/connection')

app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)

app.get('/user', (req, res) => {
  const user = new User({
    firstName: 'Bob',
    surname: 'The builder',
    email: 'bobthebuilder@gmail.com',
    username: 'bobthebuilder',
  })
  user
    .save()
    .then((result) => res.send(result))
    .catch((err) => console.log(err))
})
module.exports = app
