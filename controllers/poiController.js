const {
  selectPoisByRoute,
  insertPoi,
  updatePoi,
  removePoi,
  generateUrl,
} = require('../models/poisModels')
const { uploadImage } = require('../models/s3')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
exports.getPois = (req, res, next) => {
  const { route_id } = req.params
  selectPoisByRoute(route_id)
    .then((pois) => {
      res.status(200).send({ pois })
    })
    .catch(next)
}

exports.postPoi = async (req, res, next) => {
  const { user_id, photo, narration, coords } = req.body
  await insertPoi(user_id, photo, narration, coords, req.params)
    .then((poi) => {
      res.status(201).send({ poi })
    })
    .catch(next)
}

exports.patchPoi = (req, res, next) => {
  updatePoi(req.body, req.params)
    .then((poi) => {
      res.status(200).send({ poi })
    })
    .catch(next)
}

exports.deletePoi = (req, res, next) => {
  removePoi(req.params)
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
}

exports.getUrl = (req, res, next) => {
  generateUrl()
    .then((uri) => {
      res.status(200).send({ uri })
    })
    .catch(next)
}
