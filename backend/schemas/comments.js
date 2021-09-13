const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema(
  {
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    comments: [
      {
        text: 'string',
        username: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    time: { type: 'integer', required: true },
  },
  { timestamp: true }
);

const Comments = mongoose.model('Comments', commentSchema);
module.exports = Comments;
