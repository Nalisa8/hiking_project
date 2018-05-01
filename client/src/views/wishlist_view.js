const ListData = require('../models/list_data.js');
const Request = require('../../../server/request.js');

const wishlistGetter = new ListData('/wishlist');
const completedListGetter = new ListData('/completed');


const ListView = function (containerOne, containerTwo) {
  this.wishlistContainer = containerOne;
  this.completedContainer = containerTwo;
  this.wishlistData = null;
  this.completedData = null;
};

ListView.prototype.renderBothLists = function() {
  wishlistGetter.getData((data) => {
    this.wishlistData = data;
    completedListGetter.getData((compData) => {
      this.completedData = compData;
      this.renderList(this.wishlistData, this.wishlistContainer);
      this.renderList(this.completedData, this.completedContainer);
    });
  })
};

ListView.prototype.renderList = function (data, container) {
  container.innerHTML = "";
  data.forEach((routeObj) => {
    const routeItem = document.createElement('li');
    this.renderDetail(routeObj, routeItem);
    container.appendChild(routeItem);
  });
};

ListView.prototype.onDeleteButtonClicked = function(deleteButton) {
  const request = new Request(`/${deleteButton.path[2].id}/${deleteButton.target.value}`);
  request.deleteOne((request) => {
    this.renderBothLists();
  });
};

ListView.prototype.onCompletedButtonClicked = function (completedButton) {
  const wishListRequest = new Request(`/wishlist/${completedButton.target.value}`);
  const completedListRequest = new Request('/completed');
  wishListRequest.get((found) => {
    delete found._id;
    completedListRequest.post((foundRoute)=> {
      this.renderBothLists();
    },found)

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
