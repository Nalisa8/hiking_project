const Utilities = function () {

}

Utilities.prototype.prettifyDistance = function (route) {
  const prettyRoute = route.distance/1000;
  return this.precisionRound(prettyRoute, 1)
};

Utilities.prototype.precisionRound = function (number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

Utilities.prototype.prettifyDuration = function (route) {
  number = Number(route.duration);
  const hours = Math.floor(number / 3600);
  const minutes = Math.floor(number % 3600 / 60);
  const hoursDisplay = hours > 0 ? hours + (hours== 1 ? " hour, " : " hours, ") : "";
  const minutesDisplay = minutes > 0 ? minutes + (minutes == 1 ? " minute " : " minutes ") : "";
  return hoursDisplay + minutesDisplay;
};

module.exports = Utilities;
