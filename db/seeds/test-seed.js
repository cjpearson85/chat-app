const faker = require('faker')
const MongoClient = require('mongodb').MongoClient
const uri = require('../../testDbUri')

async function seedDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
  })
  try {
    await client.connect()
    console.log('Connected correctly to server')
    const collection = client.db('Social-app-test-db').collection('User')
    collection.drop()

    let usersData = []
    for (let i = 0; i < 5; i++) {
      const name = faker.name.firstName() + ' ' + faker.name.lastName()
      const avatar_url = faker.name.firstName()
      const username = faker.name.firstName()
      const password = faker.name.firstName()
      usersData.push({ name, avatar_url, username, password })
    }

    await collection.insertMany(usersData)
    console.log('Database seeded! :)')
    client.close()
  } catch (err) {
    console.log(err.stack)
  }
}
seedDB()

// // const db = require('../connection')
// // const { connection } = require('mongoose');

// const uri = require('../../testDbUri')
// var seeder = require('mongoose-seed');

// seeder.connect(uri, function() {

//   seeder.loadModels([
//     '../schemas/user.js',
//   ]);

//   // Clear specified collections
//   seeder.clearModels(['User'], function() {

//     // Callback to populate DB once collections have been cleared
//     seeder.populateModels(data, function(err) {
//         if (err) console.log(err)
//       seeder.disconnect();
//     });

//   });
// });

// var data = [
//     {
//         'model': 'User',
//         'documents': [
//             {
//                 name: 'Matt Kiss',
//                 avatar_url: 'http://www.example.com',
//                 username: 'mattkiss',
//                 password: 'test123'
//             }
//         ]
//     }
// ];
