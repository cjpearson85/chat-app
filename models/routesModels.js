const Route = require('../schemas/route')

exports.selectAllRoutes = async () => {
  const result = await Route.find({})
  return result
}
