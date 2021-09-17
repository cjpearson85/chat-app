exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else next(err)
}
  
exports.handleDbErrors = (err, req, res, next) => {
  if (err._message === 'Route validation failed') {
    res.status(400).send({ msg: 'Bad request' })
  }
}
  
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err._message)
  console.log(err, '<<< unhandled error')
  res.status(500).send({ msg: 'Internal Server Error' })
}