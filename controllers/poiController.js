const {
  selectPoisByRoute,
  insertPoi,
  updatePoi,
  removePoi,
} = require('../models/poisModels');
const { uploadImage } = require('../models/s3');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.getPois = (req, res, next) => {
  const { route_id } = req.params;
  selectPoisByRoute(route_id)
    .then((pois) => {
      res.status(200).send({ pois });
    })
    .catch(next);
};

exports.postPoi = async (req, res, next) => {
  let imageLink;
  if (req.body.photo) {
    imageLink = await uploadImage(req.body.photo);
  }
  const { user_id, narration, coords } = req.body;
  await insertPoi(user_id, imageLink, narration, coords, req.params)
    .then((poi) => {
      res.status(201).send({ poi });
    })
    .catch(next);
};

exports.patchPoi = (req, res, next) => {
  updatePoi(req.body, req.params)
    .then((poi) => {
      res.status(200).send({ poi });
    })
    .catch(next);
};

exports.deletePoi = (req, res, next) => {
  removePoi(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
