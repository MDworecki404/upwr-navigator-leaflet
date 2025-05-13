import { map } from "./displayMap";
import upwrBuildings from '../layers/upwrBuildingsWithAddresses.json'
import L from 'leaflet';

let upwrBuildingsLayer = null

const defaultLayers = () => {
    upwrBuildingsLayer = L.geoJSON(upwrBuildings, {
    style: {
        color: '#FF0000',
        weight: 2,
        fillOpacity: 0.5
    },
    onEachFeature: (feature, layer) => {
        if(feature.properties.A || feature.properties.B) {
        layer.bindPopup(`
                Budynek ${feature.properties.A}
                <hr>
                Adres: ${feature.properties.B}
            `);
        }
        else if (feature.properties.A === null || feature.properties.B === null){
            layer.bindPopup(`
                Budynek UPWr
                <hr>
            `);
        }
        
    }
}).addTo(map);
}





const showUPWrBuildings = () => {
    const checkbox = document.querySelector('#upwrBuildings').checked
    
    switch(checkbox) {
        case true:
            upwrBuildingsLayer = L.geoJSON(upwrBuildings, {
                style: {
                    color: '#FF0000',
                    weight: 2,
                    fillOpacity: 0.5
                },
                onEachFeature: (feature, layer) => {
                    if(feature.properties.A || feature.properties.B) {
                    layer.bindPopup(`
                            Budynek ${feature.properties.A}
                            <hr>
                            Adres: ${feature.properties.B}
                        `);
                    }
                    else if (feature.properties.A === null || feature.properties.B === null){
                        layer.bindPopup(`
                            Budynek UPWr
                            <hr>
                        `);
                    }
                    
                }
            }).addTo(map);
            break;
        case false:
            if (upwrBuildingsLayer) {
                map.removeLayer(upwrBuildingsLayer);
                upwrBuildingsLayer = null;
            }
            break;
    }
}

export {showUPWrBuildings, defaultLayers}