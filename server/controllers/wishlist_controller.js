const express = require('express');
const server = express();
const path = require('path')
const parser = require('body-parser');

const wishListRouter = new express.Router();

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



  wishListRouter.post('/', function(req, res){

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

  wishListRouter.get('/', function (req, res) {
    console.log(wishListCollection);
    wishListCollection.find().toArray(function (err, allRoutes){
      if(err){
        res.status(500);
        res.send();
      }
      res.json(allRoutes);
    });
  });

  // DELETE BY ID
  wishListRouter.delete('/:id', function(req, res) {
    const id = req.params.id;
    const objectID = ObjectID(id);

    wishListCollection.deleteOne({ _id: objectID}, function(err, result) {
      if(err){
        console.error(err);
        res.status(500);
        res.send();
      }
      res.status(204);
      res.send();
    })
  })

  // DELETE ALL
  wishListRouter.delete('/', function ( req, res) {
    wishListCollection.deleteMany({}, function(err, result) {
      if (err){
        console.error(err);
        res.status(500);
        res.send();
      }
      res.send();
    });
  });
});
module.exports = wishListRouter;
