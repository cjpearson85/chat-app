const S3 = require('aws-sdk/clients/s3');
const { generateSalt } = require('../utils');
require('dotenv').config();

const bucketName = process.env.AWSBUCKETNAME;
const region = process.env.AWSREGION;
const accessKeyId = process.env.AWSACCESSKEYID;
const secretAccessKey = process.env.AWSSECRETACCESSKEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

exports.uploadImage = async (photo) => {
  const imageName = generateSalt();

  const uploadParams = {
    Bucket: bucketName,
    Body: photo,
    Key: imageName,
  };

  const result = s3.upload(uploadParams).promise();
  return (await result).Location;
};
