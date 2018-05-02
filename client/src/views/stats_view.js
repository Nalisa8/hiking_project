const Utilities = require('../models/utilities.js')

const StatsView = function(container) {
  this.container = container;
};

const utilities = new Utilities;

StatsView.prototype.renderRouteStats = function (route) {
  this.container.innerHTML ='';

  const startLocation = document.createElement('p');
  const endLocation = document.createElement('p');
  const distance = document.createElement('p');
  const duration = document.createElement('p');

  if (route === undefined) {
    startLocation.textContent = 'Start Location: ';
    endLocation.textContent = 'End Location: ';
    distance.textContent = 'Distance: ';
    duration.textContent = 'Expected Duration: ';
  } else {
    const prettyDistance = utilities.prettifyDistance(route);
    const prettyDuration = utilities.prettifyDuration(route);
    const prettyStartLat = utilities.prettifyLatOrLng(route.start.lat);
    const prettyStartLng = utilities.prettifyLatOrLng(route.start.lng);
    const prettyEndLat = utilities.prettifyLatOrLng(route.end.lat);
    const prettyEndLng = utilities.prettifyLatOrLng(route.end.lng);
    
    startLocation.textContent = 'Start Location: ' + prettyStartLat + ' , ' + prettyStartLng;
    endLocation.textContent = 'End Location: ' + prettyEndLat + ' , ' + prettyEndLng;
    distance.textContent = 'Distance: ' + prettyDistance + ' km';
    duration.textContent = 'Expected Duration: ' + prettyDuration;
  };

  this.container.appendChild(startLocation);
  this.container.appendChild(endLocation);
  this.container.appendChild(distance);
  this.container.appendChild(duration);
};

module.exports = StatsView;
