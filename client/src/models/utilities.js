const Utilities = function () {

}

Utilities.prototype.prettifyDistance = function (route) {
  const routeInKm = route.distance/1000;
  const midRoute = this.precisionRound(routeInKm, 1);
  const finalRoute = midRoute + " km";
  return finalRoute;
};

Utilities.prototype.prettifyLatOrLng = function (number) {
  return this.precisionRound(number, 3)
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
