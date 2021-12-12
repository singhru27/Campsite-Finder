mapboxgl.accessToken = MAP_TOKEN;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: currGeocache.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
  .setLngLat(currGeocache.geometry.coordinates)
  .setPopup(new mapboxgl.Popup().setHTML(`<h4>${currGeocache.title}</h4>`)) // add popup
  .addTo(map);
