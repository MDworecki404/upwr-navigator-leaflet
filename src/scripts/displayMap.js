import L from 'leaflet'
import '../plugins/ActiveLayers'

let map

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
const terrain = L.tileLayer(
    'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
    {
    attribution: 'Autor: <b></i>Marek Dworecki</i></b> | Map data ©2025 Google'
}
);

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
        case 'Terrain':
            basemap = terrain;
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

export {displayMap, map, changeBaseMap}