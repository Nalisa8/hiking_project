const ListView = function (container, allData) {
  this.container = container;
  this.allData = allData;
};

ListView.prototype.renderList = function () {
  this.allData.forEach((routeObj) => {
    const routeItem = document.createElement('li');
    renderDetail(routeObj, routeItem);
    this.container.appendChild(routeItem);
  });
};

ListView.prototype.renderDetail = function (routeObj, routeItem) {
  const startLat = document.createElement('p');
  startLat.textContent = "Start Lat:" + routeItem.start.lat;

  const startLng = document.createElement('p');
  startLng.textContent = "Start Lng:" + routeItem.start.lng;

  const endLat = document.createElement('p');
  endLat.textContent = "End Lat:" + routeItem.end.lat;

  const endLng = document.createElement('p');
  endLng.textContent = "End Lng:" + routeItem.end.lng;

  const distance = document.createElement('p');
  distance.textContent = "Distance:" + routeItem.distance;

  const duration = document.createElement('p');
  duration.textContent = "Duration:" + routeItem.duration;

  routeItem.appendChild(startLat)
  routeItem.appendChild(startLng)
  routeItem.appendChild(endLat)
  routeItem.appendChild(endLng)
  routeItem.appendChild(distance)
  routeItem.appendChild(duration)
};

module.exports = ListView;
