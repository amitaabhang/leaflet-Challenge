// Get data url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
tectonicplatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"


// Get earthquakes and tectonic plates data
d3.json(url, function(data) {
    d3.json(tectonicplatesUrl, function(platesData) {
      
        createFeatures(data.features, platesData.features)
    });
});

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


function createFeatures(earthquakeData, platesData) {

    var deptharr = []


    // Create popup layers 
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
        // Add pop up details
        onEachFeature: onEachFeature
    });
    
    /*console.log(deptharr.length)
    for( i=0; i<=deptharr.length; i++)
    {
     console.log(deptharr[i])
    }*/
  
    
    var plates = L.geoJSON(platesData, {
        style: function() {
            return {
                color: "Blue",
                weight: 2.5
            }
        }
    });
    // Call create map function using the earthquakes and plates data
    createLayeredMap(earthquakes, plates);
};

function createLayeredMap(earthquakes, plates)
{

    // Define streetmap  darkmap and satellite layers
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


  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
    });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Fault Lines": plates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [29.876019, -107.224121],
    zoom: 4.5,
    layers: [satellite, earthquakes, plates]
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
        "salmon",
        "lightsalmon",
      "palevioletred"]


    for (var i = 0; i < categories.length; i++) {

        div.innerHTML += 
        labels.push("<li style=\"background-color: " + colors[i] +  categories[i] ? categories[i] :+ "\"></li>");
        labels.push("<li style=\"background-color: " + colors[i] + "\"></li>");
        

    }
    div.innerHTML = labels.join('<br>');
    return div;
    };

    legend.addTo(myMap);

};





