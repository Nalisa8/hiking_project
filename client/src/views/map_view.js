const GoogleMaps = require('google-maps');

const MapView = function (container, options) {
  this.container = container;
  this.options = options;
  this.google = null;
  this.googleMap = null;
};

MapView.prototype.render = function () {
  GoogleMaps.load((google) => {
    this.google = google;
    this.googleMap = new this.google.maps.Map(this.container, this.options);
    this.addMarkerOnClick();
  });
};

MapView.prototype.addMarker = function (coords) {
  const marker = new this.google.maps.Marker({
    position: coords,
    map: this.googleMap
  });
};

MapView.prototype.addMarkerOnClick = function () {
  this.googleMap.addListener('click', (event) => {
    this.addMarker(event.latLng);
  });
};


module.exports = MapView;
