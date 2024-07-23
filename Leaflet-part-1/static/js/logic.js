//---------------------------- Step1-----------------------------

//Importing our geoJSON dataset from USGS GeoJSON Feed and storing it into a variable
let  earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Impoting earthquakes data using d3.JSON
d3.json(earthquakeURL).then(function(data){

    //Console loging the fetched data
    console.log(data.features);

    //Passing the fetched data.features to a createFeatures() function
    createFeatures(data.features)

});

//-------------------------------Step2--------------------------------------


// Function to Determine Color of Markers Based on the Magnitude of the Earthquake
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
//Loading and visualizing the GeoJSON data
//Calling the createFeatures function and loading the data
function createFeatures(earthquakeData){

    //Defining a popup with features related to each earthquake
    function onEachFeature(feature, layer){
           layer.bindPopup(`<b>Location : </b> ${feature.properties.place}</br>
                         <b>Date : </b>${new Date(feature.properties.time)}</br>
                         <b>Magnitude : </b>${feature.properties.mag}</br>
                         <b>Depth : </b>${feature.geometry.coordinates[2]}</br>`)

};

   //adding the earthquake data to the map
   function mapStyle(feature){
    return {
            opacity:1,
            fill0pacity: 0.7,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.3
          };
};   

    // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
    function mapRadius(mag) {
        if (mag === 0) {
        return 1;
        }
        return mag * 3;
};

     //Running the oneachFeature() function for each instance of a earthquake
    let earthquake = L.geoJSON(earthquakeData, {
    onEachFeature : onEachFeature,
 
     //map style
     style:mapStyle,

    //Point to layer
     pointToLayer : function(feature, latlng) {
        return L.circleMarker(latlng , feature.geometry.coordinates[2])},

    // Add earthquakes Layer to the Map  
     }).addTo(myMap);
}


//creating the map object
let myMap = L.map('map', {
    center:[39.73, -104.99],
    zoom:4
});

//creating the tile layer
let street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);

//------------------------------step3--------------------------
//
 // Add legend
 let legend = L.control({position: "bottomright"});
 legend.onAdd = function() {
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

    


        



















