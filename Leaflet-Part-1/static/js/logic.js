const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl)
  .then(earthquakeData => {
    createFeatures(earthquakeData.features);
  })
  .catch(error => {
    console.log("Error fetching earthquake data:", error);
  });

var map = L.map('map').setView([37.8, -96], 5);

// Add the tile layer (OpenStreetMap)
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function createFeatures(earthquakeFeatures) {
  // Create a layer group for the markers
  var earthquakes = L.geoJson(earthquakeFeatures, {
    pointToLayer: createMarker,
  });

  // Add the earthquake layer to the map
  earthquakes.addTo(map);

  // Create the legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = ['#26EC48', '#FDFE0D', '#FFC80D', '#FF7E26', '#FF894D', '#EC1C23'];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
}

// Create markers whose size increases with magnitude and color with depth
function createMarker(feature, latlng) {
  var marker = L.circleMarker(latlng, {
    radius: markerSize(feature.properties.mag),
    fillColor: markerColor(feature.geometry.coordinates[2]),
    color: "#000",
    weight: 0.5,
    opacity: 0.5,
    fillOpacity: 1
  });

  // Create a popup with earthquake information
  var popupContent = `<strong>${feature.properties.title}</strong><br>
                      Magnitude: ${feature.properties.mag}<br>
                      Depth: ${feature.geometry.coordinates[2]}`;

  marker.bindPopup(popupContent);

  return marker;
}

// Change marker color based on depth
function markerColor(depth) {
  let color = "#B5E61D";
  switch (true) {
    case (depth < 10):
      color = "#03E604";
      break;
    case (depth < 30):
      color = '#A4FE0B';
      break;
    case (depth < 50):
      color = '#B5E61D';
      break;
    case (depth < 70):
      color = '#D5FE0D';
      break;
    case (depth < 90):
      color = '#FF2E15';
      break;
  }

  return color;
}

// Define the marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 4;
}



