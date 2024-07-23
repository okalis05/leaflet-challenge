// Storing the Earthquakes & Tectonic Plates data url into Variables
let earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"



// Initializing the LayerGroups for the earthquakes & tectonicPlates
let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();

createMap(earthquakes)

// Decclaring the color of Marker Based on the depth of the Earthquake
function mapColor(depth) {
    if (depth < 10)
        return "#00FF00";
    else if (depth < 30)
        return "#ADFF2F";
    else if (depth < 50)
        return "#FFFF00";
    else if (depth < 70)
        return "#FFB700";
    else if (depth < 90)
        return "#FFA500";
    else return "orangered";
};

async function createMap(earthquakes) {
    // Defining variables for Tile Layers
    //Street View
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let sateliteMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,<a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    });
    

    let darkMap = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
});


    //Define baseMaps Object to Hold Base Layers
    let baseMaps = {
        "Street View": streetMap,
        "Satelite view": sateliteMap,
        "Night view": darkMap
    };

    // Create Overlay Object to Hold Overlay Layers
    let overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };


    // Create Map, Passing In streetMap, earthquakes as Default Layers to Display on Load
    let myMap = L.map("map", {
        center: [39.73, -104.99],
        zoom: 2
    });

    // Importing earthquages data using  the D3 library
    let earthquakeData = await d3.json(earthquakesURL)

    //console log the data retrieved
    console.log(earthquakeData)

    //loading the earthquake data to the createFeatures() function
    createFeatures(earthquakeData.features);


    //calling the createFeatures function
    async function createFeatures(earthquakeData) {

        // Decclaring the size of Marker Based on the Magnitude of the Earthquake
        function markerSize(magnitude) {
            if (magnitude === 0) {
                return 1;
            }
            return magnitude * 3;
        }
        // Decclaring the style of Marker Based on the Magnitude of the Earthquake
        function styleInfo(feature) {
            return {
                opacity: 0.3,
                fillOpacity: 0.3,
                fillColor: mapColor(feature.geometry.coordinates[2]),
                color: "#000000",
                radius: markerSize(feature.properties.mag),
                stroke: true,
                weight: 0.5
            };
        }
        // Retrieve platesURL (Tectonic Plates GeoJSON Data) with D3
        let plateData = await d3.json(platesURL)
        console.log(plateData)
        // Create a GeoJSON Layer the plateData
        L.geoJson(plateData.features, {
            color: "orange",
            fillOpacity:0.5,
            weight: 2

            // Add plateData to tectonicPlates LayerGroups 
        }).addTo(tectonicPlates);
        // Add tectonicPlates Layer to the Map
        tectonicPlates.addTo(myMap);


        // Create a GeoJSON Layer Containing the Features Array on the earthquakeData 
        L.geoJSON(earthquakeData, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            style: styleInfo,
            // Function to Run Once For Each feature in the features Array
            // Giving each occurrence some metadata
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>Location : </b> ${feature.properties.place}</br>
                <b>Date : </b>${new Date(feature.properties.time)}</br>
                <b>Magnitude : </b>${feature.properties.mag}</br>
                <b>Depth : </b>${feature.geometry.coordinates[2]}</br>`)

            }
            // Add earthquakeData to earthquakes LayerGroups 
        }).addTo(earthquakes);

        // Add earthquakes Layer to the Map
        earthquakes.addTo(myMap);



    }
    // Set Up Legend

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap)


    // Create a Layer Control + Pass in baseMaps and overlayMaps + Add the Layer Control to the Map
    L.control.layers(baseMaps, overlayMaps, {
    }).addTo(myMap);


}

