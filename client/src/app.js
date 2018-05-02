// const apiKey = AIzaSyBh5r8e1rHqG7LjFJVy3DrR0I4_GMaoPcA
const MapView = require('./views/map_view.js');
const ListView = require('./views/wishlist_view.js');
const Request = require('../../server/request.js');
const ListData = require('./models/list_data.js');
const StatsView = require('./views/stats_view.js');
const Elevation = require('./views/elevation_view.js');

const appStart = function() {
  const routeStatsContainer = document.querySelector('#stats-list');
  const statsView = new StatsView(routeStatsContainer);

  statsView.renderRouteStats();

  const wishlistHandler = new ListData('/wishlist');
  const wishlistContainer = document.querySelector('#wishlist')

  const completedListHandler = new ListData('/completed');
  const completedContainer = document.querySelector('#completed');

  const listView = new ListView(wishlistContainer, completedContainer);

  const getDataThenRenderLists = function () {
    wishlistHandler.getData((wishListData) => {
      listView.wishlistData = wishListData;
      completedListHandler.getData((completedData) => {
        listView.completedData = completedData;
        listView.renderBothLists();
      });
    });
  };

  getDataThenRenderLists();

  const mapContainer = document.querySelector('#map');
  const elevationContainer = document.querySelector('#elevation-chart');

  const mapOptions = {
    zoom: 7,
    center: {lat: 56.4907, lng: -4.2026},
    mapTypeId: 'terrain'
  };

  const mapView = new MapView(mapContainer, elevationContainer, mapOptions);
  mapView.render();

  const form = document.querySelector('#route-name');

  const locationForm = document.querySelector('#find-location');

  const handleFormSubmit = function (event) {
    event.preventDefault();
    const routeName = this.name.value;
    console.log(routeName);
    console.log(this.name);
    mapView.route["name"] = routeName;

    const request = new Request('/wishlist');

    request.post((routeAdded) => {
      getDataThenRenderLists();
    }, mapView.route);

    mapView.render();
    statsView.renderRouteStats();
    form.reset();
  };

  const handleLocationFormSubmit = function (event) {
    event.preventDefault();
    const inputtedStart = this.start[0].value;
    mapView.codeAddress(inputtedStart);
    // mapView.render();
    // form.reset();

  };

  form.addEventListener('submit', handleFormSubmit);
  locationForm.addEventListener('submit', handleLocationFormSubmit);

};

document.addEventListener('DOMContentLoaded', appStart);
