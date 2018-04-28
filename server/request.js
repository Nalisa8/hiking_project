const Request = function (url){
  this.url = url;
}

Request.prototype.get = function (onComplete) {
  const request= new XMLHttpRequest();
  request.open('GET', this.url);
  request.addEventListener('load', function () {
    if (request.status !== 200) return;

    const response = JSON.parse(request.responseText);
    onComplete(response);
  });
  request.send();
};


Request.prototype.post = function (onComplete, payload) {
    const request = new XMLHttpRequest();
    request.open('POST', this.url);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
      if(request.status !== 201) return;

      const response = JSON.parse(request.responseText);
      onComplete(response);
    });
    const jsonPayload = JSON.stringify(payload);
    request.send(jsonPayload);
};

Request.prototype.deleteAll = function (onComplete) {
  const request = new XMLHttpRequest();
  request.open('DELETE', this.url);

  request.addEventListener('load', function(){
    if (request.status !==200) return;
    onComplete();
  })
  request.send();
};

Request.prototype.deleteOne = function (onComplete) {
  const request = new XMLHttpRequest();
  request.open('DELETE', this.url);
  request.addEventListener('load', function (){
    if (request.status !== 204) return;
    onComplete();
  });
  request.send();
};

module.exports = Request;
