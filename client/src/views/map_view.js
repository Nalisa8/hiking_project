const GoogleMaps = require('google-maps');
const StatsView = require('./stats_view.js');
const GoogleCharts = require('google-charts').GoogleCharts;

const MapView = function (container, elevationContainer, options) {
  this.container = container;
  this.elevationContainer = elevationContainer;
  this.options = options;
  this.google = null;
  this.googleCharts = null;
  this.googleMap = null;
  this.directionsService = null;
  this.directionsRenderer = null;
  this.elevationService = null;
  this.elevationChart = null;
  this.elevationData = null;
  this.geocoder = null;
  this.markers = [];
  this.route = null;
  this.geodesicPoly = null;
  this.waypoints = [];
  this.tempArray = [];
  this.markersAsLatLng = [];
};

MapView.prototype.render = function () {
  GoogleMaps.load((google) => {
    this.markers = [];
    this.waypoints = [];
    this.route = null;
    this.tempArray = [];
    this.google = google;
    this.renderElevationService();
    this.googleMap = new this.google.maps.Map(this.container, this.options);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer({suppressMarkers: true});
    this.addMarkerOnClick();
    this.directionsRenderer.setMap(this.googleMap);
    this.geocoder = new this.google.maps.Geocoder();
    this.geodesicPoly = new google.maps.Polyline({
      strokeColor: '#CC0099',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      geodesic: true,
      map: this.googleMap
    });
  });
  const checkbox = document.querySelector('#checkbox')
  checkbox.addEventListener('change', function() {
    if(this.checked){
      console.log('box checked');
    } else {
      console.log('box not checked');
    }
  })
}

MapView.prototype.renderElevationService = function () {
  GoogleCharts.load(() => {
    this.googleCharts = GoogleCharts.api;
    this.elevationChart = new this.googleCharts.visualization.ColumnChart(this.elevationContainer);
    this.elevationService = new this.google.maps.ElevationService();
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
  if(this.markers.length >= 10) { return };
  const marker = new this.google.maps.Marker({
    position: coords,
    map: this.googleMap,
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
    const start = {
      lat: this.markers[0].position.lat(),
      lng: this.markers[0].position.lng()
    };
    const end = {
      lat: lastMarker.position.lat(),
      lng: lastMarker.position.lng()
    };
    this.getWaypointMarkers();
    this.convertWayPointsToLocation();
    this.calcRoute(start, end, this.waypoints);
  });
};

MapView.prototype.getWaypointMarkers = function () {
  this.tempArray = [];
  this.markers.map((marker) => {this.tempArray.push(marker)});
  this.tempArray.splice(-1, 1);
  this.tempArray.shift();
};

MapView.prototype.convertWayPointsToLocation = function () {
  this.waypoints = [];
  this.tempArray.forEach((marker) => {
    this.waypoints.push({
      location: `${marker.position.lat()}, ${marker.position.lng()}`
    })
  });
};

MapView.prototype.convertMarkersToLatLng = function () {
  this.markersAsLatLng = [];
  this.markers.forEach((marker) => {
    this.markersAsLatLng.push({
      lat: marker.position.lat(),
      lng: marker.position.lng()
    })
  })
};

MapView.prototype.updateDirectPath = function () {
  const path = []
  this.markers.forEach((marker) => {
    path.push(marker.getPosition())
  })
  this.geodesicPoly.setPath(path);
};

MapView.prototype.removeMarkerOnClick = function(marker) {
  google.maps.event.addListener(marker, 'click', (event) => {
    this.markers = this.markers.filter(dummyMarker => dummyMarker !== marker);
    marker.setMap(null);
    const lastMarker = this.markers[this.markers.length-1];
    const start = {
      lat: this.markers[0].position.lat(),
      lng: this.markers[0].position.lng()
    };
    const end = {
      lat: lastMarker.position.lat(),
      lng: lastMarker.position.lng()
    };
    this.getWaypointMarkers();
    this.convertWayPointsToLocation();
    this.calcRoute(start, end, this.waypoints);
  });
};

MapView.prototype.calcRoute = function(start, end, waypoints, inputName) {
  const request = {
    origin: start,
    destination: end,
    waypoints: waypoints,
    travelMode: 'WALKING'
  };
  this.directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      this.directionsRenderer.setDirections(result);
      this.route = this.getRouteData(result, inputName);
    };
    this.updateDirectPath();
    this.getElevationAlongPath();
    this.convertWayPointsToLocation();
    this.convertMarkersToLatLng();
  });
};

MapView.prototype.getRouteData = function (result, inputName) {
  const startRouteData = result.routes[0].legs[0];
  const endRouteData = result.routes[0].legs.slice(-1).pop();
  const routeData = result.routes[0].legs[0];
  let totalDistance = this.calculateTotalDistance(result);
  let totalDuration = this.calculateTotalDuration(result);
  const routeDataObject = {
    name: inputName,
    start: {lat: startRouteData.start_location.lat(), lng: startRouteData.start_location.lng()},
    end: {lat: endRouteData.end_location.lat(), lng: endRouteData.end_location.lng()},
    waypoints: this.waypoints,
    distance: totalDistance,
    duration: totalDuration
  };
  const routeStatsContainer = document.querySelector('#stats-list');
  const statsView = new StatsView(routeStatsContainer);
  statsView.renderRouteStats(routeDataObject);
  return routeDataObject;
};

MapView.prototype.getElevationAlongPath = function () {
  this.elevationService.getElevationAlongPath({
    'path': this.markersAsLatLng,
    'samples': 256
  }, (elevations, status) => {
    this.plotElevation(elevations, status)
  });
};

MapView.prototype.plotElevation = function (elevations, status) {
  if (status !== 'OK') {
    this.elevationContainer.innerHTML = 'Cannot show elevation: request failed because ' + status;
    return;
  }
  this.elevationData = new this.googleCharts.visualization.DataTable();
  this.elevationData.addColumn('string', 'Sample');
  this.elevationData.addColumn('number', 'Elevation');
  for (let i = 0; i < elevations.length; i++) {
    this.elevationData.addRow(['', elevations[i].elevation]);
  }
  this.elevationChart.draw(this.elevationData, {
    height: 150,
    legend: 'none',
    titleY: 'Elevation (m)'
  });
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
