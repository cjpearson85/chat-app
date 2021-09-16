const mongoose = require('mongoose')
const testData = require('./db/data/test-data/index')

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      if (error.message === 'ns not found') return
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
    }
  }
}

async function seedAllCollections () {
  for (let model in testData) {
    await mongoose.connection.models[model.charAt(0).toUpperCase() + model.slice(1)]
      .insertMany(testData[model])
  }
}

module.exports = {
  setupDB () {
    beforeAll(async () => {
      const url = `mongodb://127.0.0.1/test`
      await mongoose.connect(url)
    })

    beforeEach(async () => {
      await seedAllCollections()
    })

    afterEach(async () => {
      await removeAllCollections()
    })

    afterAll(async () => {
      await dropAllCollections()
      await mongoose.connection.close()
    })
  }
}