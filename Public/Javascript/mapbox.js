mapboxgl.accessToken = MAP_TOKEN;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-v9",
  center: currCampground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker()
  .setLngLat(currCampground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup().setHTML(`<h4>${currCampground.title}</h4>`)) // add popup
  .addTo(map);
