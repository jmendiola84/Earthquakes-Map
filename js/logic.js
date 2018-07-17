var mapboxAccessToken = "access_token=pk.eyJ1Ijoiam1lbmRpb2xhODQiLCJhIjoiY2ppY2F0eHBvMDF4cDNrcWxhNzRlcjJscCJ9.v-rM6PLJGHFDlWRLzILAQA"

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var techtonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(queryUrl, function(data) {
    createMarkers(data.features);
});

function createMarkers(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><p><b>Magnitude:</b> M" + feature.properties.mag + '</p><a href="'+ feature.properties.url + '" target="_blank">More Info</a>');
    },

    pointToLayer: function(feature, latlng) {
        return new L.circle(latlng, {
            radius: feature.properties.mag * 30000, 
            fillColor: getColor(feature.properties.mag),
            fillOpacity: 0.5,
            stroke: false 
        })

        function getColor(d) {
            return  d > 5 ? "#FF0000":
                    d > 4 ? "#FF6600":
                    d > 3 ? "#FFCC00":
                    d > 2 ? "#CCFF00":
                    d > 1 ? "#66FF00" :
                            "#00FF00";
        };

        // function getRadius(d) {
        //     return d * 50000;
        // }
    }
    });

createMap(earthquakes); 
}

    function createMap(earthquakes) {
		var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/jmendiola84/cjjp32a1503q82smj15g1mv0t/tiles/256/{z}/{x}/{y}?" + mapboxAccessToken);
        var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/jmendiola84/cjjnq18zy0fyt2rmu17i90xv5/tiles/256/{z}/{x}/{y}?" + mapboxAccessToken);
        var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/jmendiola84/cjjp3d0ib0omd2rs0qphbe6dm/tiles/256/{z}/{x}/{y}?" + mapboxAccessToken);

    var faultLines = L.layerGroup()

    
    var baseMaps = {
		"Satellite": satellite,
		"Grayscale": grayscale,
        "Outdoors": outdoors, 
    };

    var overlayMaps = {
		"Fault Lines": faultLines,
        "Earthquakes": earthquakes,
    };

d3.json(techtonicUrl, function(faultLinesData){
    L.geoJson(faultLinesData, {
        color: "orange",
        weight: 0.5,
})
 .addTo(faultLines);    

    var map = L.map("map", {
        center: [40, -70],
        zoom: 3., 
        layers: [outdoors, earthquakes, faultLines]
    });


    L.control.layers(baseMaps, overlayMaps, {
        collapsed:true
    }).addTo(map);

var legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {
    
    var div = L.DomUtil.create("div", "info legend"), 
        grades = [0, 1, 2, 3, 4, 5,],
        labels = [];

        for  (var i =0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] +1) + '"></i> ' 
                + grades[i] + (grades[i +1] ? `&ndash;` + grades[i + 1] + '<br>' : '+');
        }

        return div;
};

legend.addTo(map);

function getColor(d) {
    return  d > 5 ? "darkblue":
            d > 4 ? "darkgreen":
            d > 3 ? "red":
            d > 2 ? "orange":
            d > 1 ? "yellow" :
                    "lightyellow";
} 

    })
}