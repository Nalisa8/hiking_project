const ListView = function (container, request) {
  this.container = container;
  this.request = request;
};


ListView.prototype.getDataThenRenderList = function () {
  this.request.get((data) => {
    this.renderList(data);
  });
};

ListView.prototype.renderList = function (data) {
  this.container.innerHTML = "";
  data.forEach((routeObj) => {
    const routeItem = document.createElement('li');
    this.renderDetail(routeObj, routeItem);
    this.container.appendChild(routeItem);
  });
};

ListView.prototype.onDeleteButtonClicked = function(deleteButton) {
  const oldRequest = `${this.request.url}`
  this.request.url = `${this.request.url}/${deleteButton.target.value}`
  this.request.deleteOne(() => {
    this.request.url = oldRequest;
    this.getDataThenRenderList();
  });
}

ListView.prototype.onCompletedButtonClicked = function (completedButton) {
  const completedContainer = document.querySelector('#completed-list');
  const findRequest = `${this.request.url}/${completedButton.target.value}`;
  this.request.url = findRequest;
  this.request.get((found) => {
    delete found._id;
    this.request.url = '/completed';
    this.request.post((foundRoute)=> {
      this.request.url = '/completed';
      this.container = completedContainer;
      this.getDataThenRenderList();
    },found)

      this.request.url = `/wishlist`;
      this.onDeleteButtonClicked(completedButton);
  });

};


ListView.prototype.renderDetail = function (routeObj, routeItem) {

  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  deleteButton.value = routeObj._id;

  deleteButton.addEventListener('click', (deleteButton) => {
    this.onDeleteButtonClicked(deleteButton);
  });

  const completedButton = document.createElement('button');
  completedButton.textContent = "Completed";
  completedButton.value = routeObj._id;
  completedButton.className = "completed-button";


  completedButton.addEventListener('click', (completedButton) => {
    this.onCompletedButtonClicked(completedButton);
  });


  const name = document.createElement('p');
  name.textContent = "Route Name:" + routeObj.name;

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

  routeItem.appendChild(deleteButton);
  routeItem.appendChild(completedButton);
  routeItem.appendChild(name);
  routeItem.appendChild(startLat);
  routeItem.appendChild(startLng);
  routeItem.appendChild(endLat);
  routeItem.appendChild(endLng);
  routeItem.appendChild(distance);
  routeItem.appendChild(duration);
};

module.exports = ListView;
