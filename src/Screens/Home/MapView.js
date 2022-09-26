import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
export default (latlng, countryIso3) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
  
    <title>Quick Start - Leaflet</title>
  
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
    <link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />
  
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
      crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
      integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
      crossorigin=""></script>
  
  </head>
  
  <body>
    <div id="mapid" style="width: ${width}px; height: ${height * 0.8}px"></div>
    <script>
  
      var mymap = L.map('mapid').setView([${latlng.lat}, ${latlng.lng}], 3);
  
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdvYi1yZWFsdG9yc2Nob2ljZSIsImEiOiJja3g2Y3I3cjkwZDJvMm9xbWZ4NmtubnNlIn0.21R411Mv1MjBwPswsdSRZg', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
      }).addTo(mymap);
  
  
      function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      (async function () {
        let adm = 1
        const res = await fetch("https://www.geoboundaries.org/data/geoBoundariesSSCU-3_0_0/${countryIso3}/ADM1/geoBoundariesSSCU-3_0_0-${countryIso3}-ADM1.geojson");
        res.json().then(geojsonFeature => {
          console.log(geojsonFeature.features)
          let arrGeoJSON = []
          for (let i = 0; i < geojsonFeature.features.length; i++) {
            setTimeout(()=>{
              const oneFeature = geojsonFeature.features[i];
              oneFeature.properties = { ...oneFeature.properties, "fill": "red", "stroke-width": "3", "fill-opacity": 0.6 }
    
              let oneFeaturet = {
                "type": "FeatureCollection",
                "features": [oneFeature]
              }
              arrGeoJSON.push(oneFeaturet)
              let geoJSON = L.geoJSON(oneFeaturet,
                {
                  color: 'black',
                  fillColor: generateRandomColor(),
                  fillOpacity: 0.5,
                  weight: 1,
                }
              ).addTo(mymap);
              geoJSON.on("click", (data) => {
                mymap.setView([data.latlng.lat, data.latlng.lng], 6) ;
                // window.ReactNativeWebView.postMessage(data.latlng);

                window.postMessage(JSON.stringify(data.latlng));
              });

            },0);
  
          }
        })
      })()
    </script>
  
  
  
  </body>
  
  </html>`;
};
