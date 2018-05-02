const Request = require('../../../server/request.js');

const ListData = function (url) {
  this.url = url;
  this.data = null;
}

ListData.prototype.getData = function (onComplete) {
  const request = new Request(this.url);
  request.get((data) => {
    this.data = data;
    onComplete(data);
  });
};

module.exports = ListData;
