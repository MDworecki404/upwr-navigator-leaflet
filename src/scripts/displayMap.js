import L from 'leaflet'
import '../plugins/ActiveLayers'

let map
let currentRouteLayer = null;

const hybrid = L.tileLayer(
    'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', 
    {
    attribution: 'Autor: <b></i>Marek Dworecki</i></b> | Map data ©2025 Google'
    }
);
const osm = L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
    attribution: 'Autor: <b></i>Marek Dworecki</i></b> | © OpenStreetMap contributors'
}
);
const satellite = L.tileLayer(
    'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
    {
    attribution: 'Autor: <b></i>Marek Dworecki</i></b> | Map data ©2025 Google'
}
);

const traffic = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}&hl={language}', {
	attribution: 'Map data &copy;2025 Google',
	subdomains: '0123',
	maxZoom: 22,
	language: 'en'
});

const googleTerrainMap = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m,transit&x={x}&y={y}&z={z}&hl={language}', {
	attribution: 'Map data &copy;2025 Google',
	subdomains: '0123',
	maxZoom: 22,
	language: 'en'
});

let basemap = osm

const changeBaseMap = () => {
    const selectedBaseMap = document.querySelector('input[name="basemapLayer"]:checked').value;
    console.log("Wybrana mapa bazowa:", selectedBaseMap);
    if (map) {
        map.removeLayer(basemap);
    }

    switch(selectedBaseMap) {
        case 'Hybrid':
            basemap = hybrid;
            break;
        case 'OpenStreetMap':
            basemap = osm;
            break;
        case 'Satellite':
            basemap = satellite;
            break;
        case 'Traffic':
            basemap = traffic;
            break;
        case 'GoogleTerrainMap':
            basemap = googleTerrainMap;
            break;
    }
    if (map && basemap) {
        map.addLayer(basemap);  // <- to jest kluczowe
    }
}

const displayMap = () => {

    map = L.map('map', {
        layers:[basemap]
    }).setView([51.11, 17.05], 13);

}

export function clearRouteLayer() {
  if (currentRouteLayer) {
    map.removeLayer(currentRouteLayer);
    currentRouteLayer = null;
  }
}

export function drawRoute(latlngs) {
  // usuń starą trasę:
  clearRouteLayer();

  currentRouteLayer = L.polyline(latlngs, {
    color: 'deepskyblue',
    weight: 7,
    opacity: 0.9
  }).addTo(map);

  map.fitBounds(currentRouteLayer.getBounds());
}

export {displayMap, map, changeBaseMap, currentRouteLayer}