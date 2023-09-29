let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Create the initial map
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Define a markerSize() function that will give each earthquake a marker size relative to the magnitude of the earthquake.
function markerSize(magnitude) {
  return magnitude * 15000;
}

//Define a markerFill() function that will color the markers based on the depth of the earthquake.
function markerFill(depth) {
  
  if (depth < 20){
    return '#9BD770';
  }
  else if (depth < 40){
    return '#F1F791';
  }
  else if (depth < 50){
    return '#FDE281';
  }
  else if (depth < 80){
    return '#E9B701';
  }
  else if (depth < 90){
    return '#E48D0C';
  }
  else{
    return '#950E17';
  };
}

d3.json(queryUrl).then(function (data) {
    
    //Log the data into the console to ensure captrure
    console.log(data.features);
    //Assign the features dictionary to a var
    let featureData = data.features;

    //Loop to add a circle marker to each earthquake in the dataset
    for (let i = 0; i < featureData.length; i++) {
      
      //assign data to variables
      const coordinates = featureData[i].geometry.coordinates;
      const magnitude = featureData[i].properties.mag;

      // Create a LatLng object for the circle center.
      const latlng = L.latLng(coordinates[1], coordinates[0]);
      
      
      //Create a circle marker on the map, bind data onto the popup to provide information about the earthquake recorded
    let eachMarker = L.circle(latlng, {
        fillOpacity: 0.75,
        color: markerFill(coordinates[2]),
        fillColor: markerFill(coordinates[2]),
        radius: markerSize(magnitude)
      }).bindPopup(`<h3>${featureData[i].properties.title}</h3><hr><p>${new Date(featureData[i].properties.time)}</p><p>Depth: ${coordinates[2]}</p>`).addTo(myMap);
    }


    //Example for a legend used as a basis for this legend
    //https://codepen.io/haakseth/pen/KQbjdO
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(myMap) {
      var div = L.DomUtil.create("div", "legend");
      //Use the colors used in markerFill() function
      div.innerHTML += '<i style="background: #9BD770"></i><span>>10</span><br>';
      div.innerHTML += '<i style="background: #F1F791"></i><span>10-30</span><br>';
      div.innerHTML += '<i style="background: #FDE281"></i><span>30-50</span><br>';
      div.innerHTML += '<i style="background: #E9B701"></i><span>50-70</span><br>';
      div.innerHTML += '<i style="background: #E48D0C"></i><span>70-90</span><br>';
      div.innerHTML += '<i style="background: #950E17"></i><span>90+</span><br>';
      
      

      return div;
};
//Add the legend to map
legend.addTo(myMap);

});