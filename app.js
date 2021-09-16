const express = require('express')
const cors = require('cors')
const User = require('./schemas/user')
const apiRouter = require('./routers/api.router')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)

module.exports = app
