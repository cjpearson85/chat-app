const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = new Schema(
  {
    name: {
      type: 'string',
      required: false,
      maxLength: 50,
    },
    bio: {
      type: 'string',
      required: false,
      maxLength: 1000
    },
    avatar_url: {
      type: 'string',
      required: false,
      default:
        'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
      maxLength: 200,
    },
    username: { type: 'string', required: true, maxLength: 25 },
    hash: { type: 'string', required: true },
    salt: { type: 'string', required: true },
  },
  { timestamps: true }
)

userSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', userSchema)
module.exports = User
