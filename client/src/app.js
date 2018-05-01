// const apiKey = AIzaSyBh5r8e1rHqG7LjFJVy3DrR0I4_GMaoPcA
const MapView = require('./views/map_view.js');
const ListView = require('./views/wishlist_view.js');
const Request = require('../../server/request.js');
const ListData = require('./models/list_data.js');
const StatsView = require('./views/stats_view.js');


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

  const mapOptions = {
    zoom: 7,
    center: {lat: 56.4907, lng: -4.2026}
  };

  const mapView = new MapView(mapContainer, mapOptions);
  mapView.render();


  const form = document.querySelector('#route-name');
  const saveButton = document.querySelector('#save-button');

  const handleFormSubmit = function (event) {
    event.preventDefault();
    const routeName = this.name.value;
    mapView.route["name"] = routeName;

    const request = new Request('/wishlist');

    request.post((routeAdded) => {
      getDataThenRenderLists();
    }, mapView.route);

    mapView.render();
    statsView.renderRouteStats();
    form.reset();
  };

  form.addEventListener('submit', handleFormSubmit);

};

document.addEventListener('DOMContentLoaded', appStart);
