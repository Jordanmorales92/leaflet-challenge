// URL Variables
var earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonics = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

//console.log(earthquakes.features)

// Magnitude Markers

function markerSize(magnitude) {
    return magnitude * 5;
};


// Magnitude Markers

function magColor(mag) {
    if (mag > 5) {
        return 'black'
    }
    else if (mag > 4) {
        return 'red'
    }
    else if (mag > 3) {
        return 'orange'
    }
    else if (mag > 2) {
        return 'yellow'
    }
    else if (mag > 1) {
        return 'green'
    }
    else {
        return "blue"
    }
};

// Earthhquake


// Earthquake layer and Variables
var earthquake = new L.LayerGroup();

d3.json(earthquakes).then(function(earthquakeVar) {
    L.geoJSON(earthquakeVar.features, {
      pointToLayer: function(point, latlng) {
        return L.circleMarker(latlng, {radius: markerSize(point.properties.mag)});
    },

    style: function (feature) {
     return {
       fillColor: magColor(feature.properties.mag),
       fillOpacity: 0.8,
       weight: 0.2,
       color:"black"
     }
    },

    onEachFeature: function(feature, marker){
        marker.bindPopup("<br>Time:</br>" + Date(feature.properties.time) + "<br> Magnitude and Location: </br>" + feature.properties.title + "</br>" ).openPopup();
        }
    }).addTo(earthquake);
});

// Tectonic Plates

var plates = new L.LayerGroup();

d3.json(tectonics).then(function(boundaries) {
    L.geoJSON(boundaries, {
        style: function() {
            return {color: "white", fillOpacity: 0}
        }
    }).addTo(plates);
});




// Earthquake Map Creation
function createMap() {
   
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY,
      });
  

      var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.darkmap",
        accessToken: API_KEY,
      });

// Baselayer Variable
var baseLayer = {
    
    "Satellite": satellite,
    "Dark Map": darkmap
 
};

// Overlay for Maps
var overLay = {
    "Earthquakes": earthquake,
    "Tectonic Plates" : plates
};

//Map creation
var myMap= L.map("map", {
    center: [39.50, -98.35],
    zoom: 5.0,
    layers: [earthquake, plates] 
});

//Layer Controls
L.control.layers(baseLayer, overLay).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function(){
    var div = L.DomUtil.create("div", "legend");
    return div;
};
legend.addTo(myMap);

document.querySelector(".legend").innerHTML=displayLegend();

function displayLegend() {
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: 'blue'
    },{
        limit: "Mag: 1-2",
        color: 'green'
    },{
        limit: "Mag: 2-3",
        color: 'yellowgreen'
    },{
        limit: "Mag: 3-4",
        color: 'orange'
    },{
        limit: "Mag: 4-5",
        color: 'red'
    },{
        limit: 'Mag: 5+',
        color: 'darkred'
    }];

    var header = "<h3> Magnitude </h3><hr>";

    var strng = "";

    for (i = 0; i <legendInfo.length; i++) {
        strng += "<p style = \"background-color: " + legendInfo[i].color+"\">"+legendInfo[i].limit+"</P>";
    }

  return header+strng;
}
};
createMap();