// const apiKey = AIzaSyBh5r8e1rHqG7LjFJVy3DrR0I4_GMaoPcA
const MapView = require('./views/map_view.js');

const appStart = function() {
  const mapContainer = document.querySelector('#map');

  const mapOptions = {
    zoom: 7,
    center: {lat: 56.4907, lng: -4.2026}
  };

  const mapView = new MapView(mapContainer, mapOptions);

  mapView.render();
  // mapView.addMarkerOnClick();
};












document.addEventListener('DOMContentLoaded', appStart);
