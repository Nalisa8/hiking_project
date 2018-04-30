// const apiKey = AIzaSyBh5r8e1rHqG7LjFJVy3DrR0I4_GMaoPcA
const MapView = require('./views/map_view.js');
const ListView = require('./views/list_view.js');
const Request = require('../../server/request.js');

const appStart = function() {

  const wishListRequest = new Request('/wishlist');
  const wishlistContainer = document.querySelector('#wishlist')
  const wishlistView = new ListView(wishlistContainer, wishListRequest);

  wishlistView.getDataThenRenderList(true);

  console.log(wishlistView.container.id);

  const completedRequest = new Request('/completed');
  const completedContainer = document.querySelector('#completed-list')
  const completedView = new ListView(completedContainer, completedRequest);

  completedView.getDataThenRenderList(false);

  const mapContainer = document.querySelector('#map');

  const mapOptions = {
    zoom: 7,
    center: {lat: 56.4907, lng: -4.2026}
  };

  const mapView = new MapView(mapContainer, mapOptions);
  mapView.render();

  const form = document.querySelector('#route-name');
  const saveButton = document.querySelector('#save-button');

  const handleFormSubmit = function (event) {
    event.preventDefault();
    const routeName = this.name.value;
    mapView.route["name"] = routeName;
    wishListRequest.post((routeAdded) => {
      wishlistView.getDataThenRenderList(true);
    }, mapView.route);
  };
  form.addEventListener('submit', handleFormSubmit);
};

document.addEventListener('DOMContentLoaded', appStart);
