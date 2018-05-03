const ListData = require('../models/list_data.js');
const Request = require('../../../server/request.js');
const MapView = require('./map_view.js');
const Utilities = require('../models/utilities.js')

const wishlistGetter = new ListData('/wishlist');
const completedListGetter = new ListData('/completed');
const utilities = new Utilities;

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

ListView.prototype.onViewRouteButtonClicked = function(completeButton) {
  const request = new Request(`/${completeButton.path[2].id}/${completeButton.target.value}`);
  request.get((result) => {
    const mapContainer = document.querySelector('#map');
    const mapOptions = {
      zoom: 7,
      center: {lat: 56.4907, lng: -4.2026},
      mapTypeId: 'terrain'
    };
    const elevationContainer = document.querySelector('#elevation-chart');
    const mapView = new MapView(mapContainer, elevationContainer, mapOptions);
    mapView.render();
    mapView.calcRoute(result.start, result.end, result.waypoints, result.name);
    mapView.addMarker(result.start);
    mapView.addMarker(result.end);
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

  const viewRouteButton = document.createElement('button');
  viewRouteButton.textContent = "View Route";
  viewRouteButton.value = routeObj._id;

  viewRouteButton.addEventListener('click', (event) => {
    this.onViewRouteButtonClicked(event);
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  deleteButton.value = routeObj._id;

  deleteButton.addEventListener('click', (event) => {
    this.onDeleteButtonClicked(event);
  });

  const completedButton = document.createElement('button');
  completedButton.textContent = "Completed";
  completedButton.value = routeObj._id;
  completedButton.className = "completed-button";

  completedButton.addEventListener('click', (event) => {
    this.onCompletedButtonClicked(event);
  });

  const name = document.createElement('p');
  name.textContent = routeObj.name;

  const startLat = document.createElement('p');
  startLat.textContent = utilities.prettifyLatOrLng(routeObj.start.lat);

  const startLng = document.createElement('p');
  startLng.textContent = utilities.prettifyLatOrLng(routeObj.start.lng);

  const endLat = document.createElement('p');
  endLat.textContent = utilities.prettifyLatOrLng(routeObj.end.lat);

  const endLng = document.createElement('p');
  endLng.textContent = utilities.prettifyLatOrLng(routeObj.end.lng);

  const distance = document.createElement('p');
  distance.textContent = utilities.prettifyDistance(routeObj);

  const duration = document.createElement('p');
  duration.textContent = utilities.prettifyDuration(routeObj);

  routeItem.appendChild(viewRouteButton);
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
