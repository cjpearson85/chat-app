const db = require('../db/connection')
const User = require('../schemas/user')
const mongoose = require('mongoose')

exports.getAllUsers = async () => {
  console.log('inside model')
  const result = await User.find({})
  return result
}

// collection.find().toArray(function(err, docs){
//     console.log("retrieved records:");
//     console.log(docs);

// console.log('inside model');
// db.collection('user').find({}, (err, arr) => {
//   return arr;
// });
