const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./schemas/user');
const apiRouter = require('./routers/api.router');

const app = express();
// connect to mongoDb
const dbURI =
  'mongodb+srv://mattk47:test1234@socialtourapp.dystg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/user', (req, res) => {
  const user = new User({
    firstName: 'Bob',
    surname: 'The builder',
    email: 'bobthebuilder@gmail.com',
    username: 'bobthebuilder',
  });
  user
    .save()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

module.exports = app;
