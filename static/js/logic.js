// Get data url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function getColorByDepth(depth)
{
    switch(true) {

        case depth >= 100:
        return 	"orangered";
          
        case depth >= 90:
        return 	"tomato";
        

        case depth >= 80:
        return 	"maroon";

        case depth >= 70:
            return 	"darkred";

        case depth >= 60:
            return 	"red";

        case depth >= 50:
            return 	"firebrick";
    
        case depth >=40:
            return 	"crimson";
    
        case depth >= 30:
            return 	"indianred";
    
        case depth >= 20:
            return 	"lightcoral";

        case depth >= 10:
            return 	"salmon";
          
        case depth >= 0:
            return 	"lightsalmon";

        default:
            return 	"palevioletred";

      }

}


// Declare function to create map features.
function createFeatures(earthquakeData) {

    var deptharr = []


    // Create popup layers using earthquake title, type and magnitude
    function onEachFeature(feature, layer) {
        console.log(feature.geometry.coordinates[2])
        deptharr.push(feature.geometry.coordinates[2])

        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Type: " + feature.properties.type + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>" +
            "<p>Depth: " + feature.geometry.coordinates[2] + "</p>" );
    }
    //Create circle markers for each earthquake in the data set.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Make circle radius dependent on the magnitude and get color based on the same feature
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillOpacity: 1,
                color: getColorByDepth( feature.geometry.coordinates[2])
            })
        },
        // Append popups on each feature
        onEachFeature: onEachFeature
    });
    
    console.log(deptharr.length)
    for( i=0; i<=deptharr.length; i++)
    {
     console.log(deptharr[i])
    }
    // Call create map function using the earthquakes data
    createLayeredMap(earthquakes);
};

function createLayeredMap(earthquakes)
{

    // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [29.876019, -107.224121],
    zoom: 4.5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  var legend = L.control({position: "bottomright"});
  legend.onAdd = function(myMap) {
      var div = L.DomUtil.create("div", "info legend");

    labels = ['<strong>Earthquake Intensity</strong>'],
    categories = ['100+','90+','80+','70+','60+','50+','40+','30+','20+','10+','0+','<0'];

    var colors = [
        "orangered",
        "tomato",
        "maroon",
        "darkred",
        "red",
        "firebrick",
        "crimson",
        "indianred",
        "lightcoral",
        "rsalmoned",
        "lightsalmon",
      "palevioletred"]


    for (var i = 0; i < categories.length; i++) {

        div.innerHTML += 
        labels.push("<li style=\"background-color: " + colors[i] + "\"></li>");
        

    }
    div.innerHTML = labels.join('<br>');
    return div;
    };

    legend.addTo(myMap);

      /*var colors = [
          "orangered",
          "tomato",
          "maroon",
          "darkred",
          "red",
          "firebrick",
          "crimson",
          "indianred",
          "lightcoral",
          "rsalmoned",
          "lightsalmon",
        "palevioletred"];
      var labels = [];

      var legendInfo = "<h1>Earthquake intensity by Depth<h1>" + 
          "<div class=\"labels\">" +
          "<div class=\"max\">10+</div>" +
             
            
          "</div>";

      div.innerHTML = legendInfo;

      colors.forEach(function(color) {
          labels.push("<li style=\"background-color: " + color + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  // Append label to the map
  legend.addTo(myMap);*/


}


function getColor(d) {
    return d > 100 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}



// Declare function to create map
function createMap(earthquakes) {
    // Get initial light layer
    var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
    // Declare map object and set it to the map element in the DOM
    var myMap = L.map("map", {
        center: [29.876019, -107.224121],
        zoom: 4.5,
        layers: [mapLayer, earthquakes]
    });
    // Create a legend for the map based on the earthquakes data and colors
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "rgb(183, 243, 77)",
            "rgb(226, 243, 77)",
            "rgb(243, 219, 77)",
            "rgb(243, 186, 77)",
            "rgb(240, 167, 107)",
            "rgb(240, 107, 107)"];
        var labels = [];

        var legendInfo = "<h1>Earthquake intensity<h1>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">5+</div>" +
                "<div class=\"fourth\">4-5</div>" +
                "<div class=\"third\">3-4</div>" +
                "<div class=\"second\">2-3</div>" +
                "<div class=\"first\">1-2</div>" +
                "<div class=\"min\">0-1</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function(color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Append label to the map
    legend.addTo(myMap);

};

// Get earthquakes data
d3.json(url, function(data) {
    // Create features with the earthquakes data
    createFeatures(data.features)
});
