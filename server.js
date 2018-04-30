const express = require('express');
const server = express();
const path = require('path')
const parser = require('body-parser');

const wishListRouter = require('./server/controllers/wishlist_controller.js');
const completedRouter = require('./server/controllers/completed_controller.js');

server.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

server.use(parser.json());
server.use(express.static('client/public'));
server.use('/wishlist', wishListRouter);
server.use('/completed', completedRouter);

server.listen(3000, function () {
  console.log(`App listening on port ${this.address().port}`);
});
