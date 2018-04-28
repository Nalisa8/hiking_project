const express = require('express');
const server = express();
const path = require('path')
const parser = require('body-parser');

server.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

server.use(parser.json());
server.use(express.static('client/public'));

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


MongoClient.connect('mongodb://localhost:27017', function(err, client){
  if(err){
    console.error(err);
    return;
  }
  const db = client.db('hiking_routes');
  console.log('Connected to DB');
  const wishListCollection = db.collection('wishlist');

  const completedCollection = db.collection('completedlist');



});

server.listen(3000, function () {


  console.log(`App listening on port ${this.address().port}`);
});
