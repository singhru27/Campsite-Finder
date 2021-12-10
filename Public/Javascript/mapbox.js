mapboxgl.accessToken = MAP_TOKEN;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: currCampground.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker()
  .setLngLat(currCampground.coordinates)
  .addTo(map);
