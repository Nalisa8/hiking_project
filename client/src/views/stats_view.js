const StatsView = function(container) {
  this.container = container;
};


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
    const prettyDistance = this.prettifyDistance(route);
    const prettyDuration = this.prettifyDuration(route);
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

StatsView.prototype.prettifyDistance = function (route) {
  const prettyRoute = route.distance/1000;
  return this.precisionRound(prettyRoute, 1)
};

StatsView.prototype.precisionRound = function (number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

StatsView.prototype.prettifyDuration = function (route) {
  number = Number(route.duration);
  const hours = Math.floor(number / 3600);
  const minutes = Math.floor(number % 3600 / 60);
  const hoursDisplay = hours > 0 ? hours + (hours== 1 ? " hour, " : " hours, ") : "";
  const minutesDisplay = minutes > 0 ? minutes + (minutes == 1 ? " minute " : " minutes ") : "";
  return hoursDisplay + minutesDisplay;
};

module.exports = StatsView;
