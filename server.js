const express = require('express');
const server = express();
const path = require('path')
const parser = require('body-parser');

// const WishListController = require('./server/controllers/wishlist_controller.js');


server.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

server.use(parser.json());
server.use(express.static('client/public'));
// server.use(require ('./server/controllers/index.js'));


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

  server.post('/wishlist', function(req, res){
    const newRoute = req.body;
    wishListCollection.save(newRoute, function(err, result){
      if(err){
        console.error(err);
        res.status(500);
        res.send();
      }
      console.log('Saved!');
      res.status(201);
      res.json(result.ops[0]);
    });
  });

  server.get('/wishlist', function (req, res) {
    wishListCollection.find().toArray(function (err, allRoutes){
      if(err){
        res.status = 500;
        res.send();
      }
      res.json(allRoutes);
    });
  });

server.listen(3000, function () {
  console.log(`App listening on port ${this.address().port}`);
});
});
