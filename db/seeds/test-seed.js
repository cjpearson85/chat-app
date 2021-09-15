const db = require('../connection')
const { connection } = require('mongoose');

var seeder = require('mongoose-seed');
 
seeder.connect(db, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    '../schemas/user.js',
  ]);
 
  // Clear specified collections
  seeder.clearModels(['User'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function(err) {
        if (err) console.log(err)
      seeder.disconnect();
    });
 
  });
});
 
var data = [
    {
        'model': 'User',
        'documents': [
            {
                name: 'Matt Kiss',
                avatar_url: 'http://www.example.com',
                username: 'mattkiss',
                password: 'test123'
            }
        ]
    }
];