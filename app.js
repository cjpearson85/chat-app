const express = require('express')
const app = express()
const cors = require('cors')
const apiRouter = require('./routers/api.router')
const {
  handleCustomErrors,
  handleDbErrors,
  handleServerErrors,
} = require('./errors.js')

app.use(cors())
app.use(express.json({limit: '1mb'}))

app.use('/api', apiRouter)

app.all('/*', (req, res, next) => {
  res.status(404).send({ status: 404, msg: 'Route not found' })
})

app.use(handleCustomErrors)
app.use(handleDbErrors)
app.use(handleServerErrors)

module.exports = app
