const GoogleMaps = require('google-maps');

const MapView = function (container, options) {
  this.container = container;
  this.options = options;
  this.google = null;
  this.googleMap = null;
  this.directionsService = null;
  this.directionsRenderer = null;
  this.markers = [];
  this.route = null;
};

MapView.prototype.render = function () {
  GoogleMaps.load((google) => {
    this.google = google;
    this.googleMap = new this.google.maps.Map(this.container, this.options);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer();
    this.addMarkerOnClick();
    this.directionsRenderer.setMap(this.googleMap);
  });
};

MapView.prototype.addMarker = function (coords) {
  const marker = new this.google.maps.Marker({
    position: coords,
    map: this.googleMap
  });
  this.markers.push(marker);
};

MapView.prototype.addMarkerOnClick = function () {
  this.googleMap.addListener('click', (event) => {
    this.addMarker(event.latLng);
    const noOfMarkers = this.markers;

    console.log(noOfMarkers.length);
    if(this.markers.length < 2) {
      return;

    } else {
      this.calcRoute(
        { lat: this.markers[0].position.lat(),
          lng: this.markers[0].position.lng()
        },
        { lat: this.markers[1].position.lat(),
          lng: this.markers[1].position.lng()
        }
      );
    };
  });
};

MapView.prototype.calcRoute = function(start, end, inputName) {
  const request = {
    origin: start,
    destination: end,
    travelMode: 'WALKING'
  };
  this.directionsService.route(request, (result, status) => {
    if (status == 'OK') {
      this.directionsRenderer.setDirections(result);
      this.route = this.getRouteData(result, inputName);
    }
  });
};


MapView.prototype.getRouteData = function (result, inputName) {
  const routeData = result.routes[0].legs[0];
  const routeDataObject = {
    name: inputName,
    start: {lat: routeData.start_location.lat(), lng: routeData.start_location.lng()},
    end: {lat: routeData.end_location.lat(), lng: routeData.end_location.lng()},
    distance: routeData.distance.text,
    duration: routeData.duration.text
  };
  return routeDataObject;
};

module.exports = MapView;
