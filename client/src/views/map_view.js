const GoogleMaps = require('google-maps');
const StatsView = require('./stats_view.js');

const MapView = function (container, options) {
  this.container = container;
  this.options = options;
  this.google = null;
  this.googleMap = null;
  this.directionsService = null;
  this.directionsRenderer = null;
  this.geocoder = null;
  // this.elevationService = null;
  this.markers = [];
  this.route = null;
  this.geodesicPoly = null;
  this.waypoints = [];
  this.tempArray = [];
};

MapView.prototype.render = function () {
  GoogleMaps.load((google) => {
    this.google = google;
    this.googleMap = new this.google.maps.Map(this.container, this.options);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer({suppressMarkers: true});
    // this.elevationService = new this.google.maps.ElevationService();
    this.geocoder = new this.google.maps.Geocoder();
    this.addMarkerOnClick();
    this.directionsRenderer.setMap(this.googleMap);
    this.geodesicPoly = new google.maps.Polyline({
         strokeColor: '#CC0099',
         strokeOpacity: 1.0,
         strokeWeight: 3,
         geodesic: true,
         map: this.googleMap
    });
  });
};


MapView.prototype.codeAddress = function(address) {
  this.geocoder.geocode({'address': address}, (results, status) => {
    if (status === 'OK') {
      this.googleMap.setCenter(results[0].geometry.location);
      this.googleMap.setZoom(10);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};



MapView.prototype.addMarker = function (coords) {
  // if(this.markers.length >= 2) {
  //   return;}
    const marker = new this.google.maps.Marker({
      position: coords,
      map: this.googleMap,
      // draggable: true
      // COULD MAKE MARKERS DRAGGABLE. NEED EVENT LISTENER ON THIS THOUGH TO RECALC ROUTE.
    });
    this.markers.push(marker);
    this.removeMarkerOnClick(marker);
  };

MapView.prototype.addMarkerOnClick = function () {
    this.googleMap.addListener('click', (event) => {
      this.addMarker(event.latLng);
      if(this.markers.length < 2) {
        return;
      };

    const lastMarker = this.markers[this.markers.length-1];
      this.calcRoute(
        { lat: this.markers[0].position.lat(),
          lng: this.markers[0].position.lng()
        },
        { lat: lastMarker.position.lat(),
          lng: lastMarker.position.lng()
        }
      );
    });
};

MapView.prototype.getWaypointMarkers = function () {
  this.tempArray = [];
  this.markers.map((marker) => {this.tempArray.push(marker)});
  this.tempArray.splice(-1, 1);
  this.tempArray.shift();
};

MapView.prototype.convertMarkersToLatLng = function () {
  this.waypoints = [];
  this.tempArray.map((marker) => {
    this.waypoints.push({
      location: `${marker.position.lat()}, ${marker.position.lng()}`,
      stopover: true
    })
  });
};


  MapView.prototype.update = function () {
    const path = [this.markers[0].getPosition(), this.markers[this.markers.length-1].getPosition()];
    this.geodesicPoly.setPath(path);
  };

  MapView.prototype.removeMarkerOnClick = function(marker) {
    google.maps.event.addListener(marker, 'click', (event) => {
      this.markers = this.markers.filter(dummyMarker => dummyMarker !== marker);
      marker.setMap(null);
    });
  };

  MapView.prototype.calcRoute = function(start, end, inputName) {
    this.getWaypointMarkers();
    this.convertMarkersToLatLng();
    const request = {
      origin: start,
      destination: end,
      waypoints: this.waypoints,
      travelMode: 'WALKING'
    };
    this.directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        this.directionsRenderer.setDirections(result);
        this.route = this.getRouteData(result, inputName);
      };
      this.update();
    });
  };


  MapView.prototype.getRouteData = function (result, inputName) {
    const startRouteData = result.routes[0].legs[0];
    const endRouteData = result.routes[0].legs.slice(-1).pop();
    const routeData = result.routes[0].legs[0];
    console.log(result);
    let totalDistance = this.calculateTotalDistance(result);
    let totalDuration = this.calculateTotalDuration(result);
    const routeDataObject = {
      name: inputName,
      start: {lat: startRouteData.start_location.lat(), lng: startRouteData.start_location.lng()},
      end: {lat: endRouteData.end_location.lat(), lng: endRouteData.end_location.lng()},
      distance: totalDistance,
      duration: totalDuration
    };
    const routeStatsContainer = document.querySelector('#stats-list');
    const statsView = new StatsView(routeStatsContainer);
    statsView.renderRouteStats(routeDataObject);
    return routeDataObject;
  };

  MapView.prototype.calculateTotalDistance = function (result) {
    let totalDistance = 0;
    result.routes[0].legs.forEach((leg) => {
      totalDistance += (leg.distance.value);
    });
    return totalDistance;
  };

  MapView.prototype.calculateTotalDuration = function (result) {
    let totalDuration = 0;
    result.routes[0].legs.forEach((leg) => {
      totalDuration += (leg.duration.value);
    });
    return totalDuration;
  };

  module.exports = MapView;
