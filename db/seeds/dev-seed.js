const faker = require('faker')
const MongoClient = require('mongodb').MongoClient
const uri = require('../../devDbUri')


async function seedDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
  })
  try {
    await client.connect()
    console.log('Connected correctly to server')
    const collection = client.db('Social-app-test-db').collection('User')
    // collection.drop();

    let usersData = []
    for (let i = 0; i < 30; i++) {
      const name = faker.name.firstName() + ' ' + faker.name.lastName() 
      const avatar_url = faker.image.imageUrl()
      const username = faker.internet.userName()
      const password = faker.internet.password()
      usersData.push({ name, avatar_url, username, password})
    }

    await collection.insertMany(usersData)
    console.log('Database seeded! :)')
    client.close()
  } catch (err) {
    console.log(err.stack)
  }
}
seedDB()