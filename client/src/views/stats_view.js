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
    startLocation.textContent = 'Start Location: ' + route.start.lat + ' , ' + route.start.lng;
    endLocation.textContent = 'End Location: ' + route.end.lat + ' , ' + route.end.lng;;
    distance.textContent = 'Distance: ' + prettyDistance + ' km';
    duration.textContent = 'Expected Duration: ' + prettyDuration;
  };

  this.container.appendChild(startLocation);
  this.container.appendChild(endLocation);
  this.container.appendChild(distance);
  this.container.appendChild(duration);
};



module.exports = StatsView;
