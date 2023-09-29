let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//initial map
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
  return magnitude * 15000;
}

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
    console.log(data.features);
    //Assign the features dictionary to a var
    let featureData = data.features;

    for (let i = 0; i < featureData.length; i++) {
      
      const coordinates = featureData[i].geometry.coordinates;
      const magnitude = featureData[i].properties.mag;
      const latlng = L.latLng(coordinates[1], coordinates[0]);
      
      let eachMarker = L.circle(latlng, {
        fillOpacity: 0.75,
        color: markerFill(coordinates[2]),
        fillColor: markerFill(coordinates[2]),
        radius: markerSize(magnitude)
      }).bindPopup(`<h3>${featureData[i].properties.title}</h3><hr><p>${new Date(featureData[i].properties.time)}</p><p>Depth: ${coordinates[2]}</p>`).addTo(myMap);
    }

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(myMap) {
      var div = L.DomUtil.create("div", "legend");
    
      div.innerHTML += '<i style="background: #9BD770"></i><span>>10</span><br>';
      div.innerHTML += '<i style="background: #F1F791"></i><span>10-30</span><br>';
      div.innerHTML += '<i style="background: #FDE281"></i><span>30-50</span><br>';
      div.innerHTML += '<i style="background: #E9B701"></i><span>50-70</span><br>';
      div.innerHTML += '<i style="background: #E48D0C"></i><span>70-90</span><br>';
      div.innerHTML += '<i style="background: #950E17"></i><span>90+</span><br>';
      
      

      return div;
};
legend.addTo(myMap);

});