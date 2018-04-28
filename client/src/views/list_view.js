const ListView = function (container, allData) {
  this.container = container;
  this.allData = allData;
};

ListView.prototype.renderList = function () {
  console.log("wassssuuuppp");
  this.allData.forEach((routeObj) => {
    const routeItem = document.createElement('li');
    this.renderDetail(routeObj, routeItem);
    this.container.appendChild(routeItem);
  });
};

ListView.prototype.renderDetail = function (routeObj, routeItem) {

  console.log(routeObj);
  const startLat = document.createElement('p');
  startLat.textContent = "Start Lat:" + routeObj.start.lat;


  const startLng = document.createElement('p');
  startLng.textContent = "Start Lng:" + routeObj.start.lng;

  const endLat = document.createElement('p');
  endLat.textContent = "End Lat:" + routeObj.end.lat;

  const endLng = document.createElement('p');
  endLng.textContent = "End Lng:" + routeObj.end.lng;

  const distance = document.createElement('p');
  distance.textContent = "Distance:" + routeObj.distance;

  const duration = document.createElement('p');
  duration.textContent = "Duration:" + routeObj.duration;

  routeItem.appendChild(startLat)
  routeItem.appendChild(startLng)
  routeItem.appendChild(endLat)
  routeItem.appendChild(endLng)
  routeItem.appendChild(distance)
  routeItem.appendChild(duration)
};

module.exports = ListView;
