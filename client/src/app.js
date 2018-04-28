// const apiKey = AIzaSyBh5r8e1rHqG7LjFJVy3DrR0I4_GMaoPcA
const MapView = require('./views/map_view.js');
const ListView = require('./views/list_view.js');
const Request = require('../../server/request.js');


const appStart = function() {
  const mapContainer = document.querySelector('#map');

  const mapOptions = {
    zoom: 7,
    center: {lat: 56.4907, lng: -4.2026}
  };

  const mapView = new MapView(mapContainer, mapOptions);
  mapView.render();

  const inputName = document.querySelector('#route-name');
  const saveButton = document.querySelector('#save-button');

  

  const wishListRequest = new Request('/wishlist');
  wishListRequest.get((data) => {
    console.log(data);
    const wishlistContainer = document.querySelector('#wishlist')
    const wishlistView = new ListView(wishlistContainer, data);
    wishlistView.renderList();
  });


};

document.addEventListener('DOMContentLoaded', appStart);
