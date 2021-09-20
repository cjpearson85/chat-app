const S3 = require('aws-sdk/clients/s3')
const { generteSalt, generateSalt } = require('../utils')

const bucketName = 'antspictures'
const region = 'eu-west-2'
const accessKeyId = 'AKIAUL6OTG43LAKNJDVW'
const secretAccessKey = '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'

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
})

exports.uploadImage = async (photo) => {
  const imageName = generateSalt()

  const uploadParams = {
    Bucket: bucketName,
    Body: photo,
    Key: imageName,
  }

  const result = s3.upload(uploadParams).promise()
  return (await result).Location
}
