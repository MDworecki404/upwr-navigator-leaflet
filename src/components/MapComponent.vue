<script>
import {changeBaseMap, displayMap} from '../scripts/displayMap.js'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import gsap from 'gsap'
import UniversityBuildings from '../data/universityBuildings.json'
import { ref } from 'vue'
import routeFinder from '../scripts/routeFinder.js'
import userRouteFinder from '../scripts/userRouteFinder.js'

export default {
  setup(){
    const buildings = ref(UniversityBuildings.buildings.flat()); // Używamy danych z importowanego JSON
    const selectedStartBuilding = ref('');
    const selectedEndBuilding = ref('');

    return {
      buildings,
      selectedStartBuilding,
      selectedEndBuilding
    }
  },

  mounted: () => {
    displayMap()
  },
  methods:{
    showPanel(panel) {

      switch(panel) {
        case 'layers':
          gsap.to('#layers_panel', {
            duration: 0,
            visibility: 'visible',
            opacity: 1,
            ease: 'power2.inOut'
          });
          gsap.to('#navigation_panel', {
            duration: 0,
            visibility: 'hidden',
            opacity: 1,
            ease: 'power2.inOut'
          });
          break;
        case 'navigation':
          gsap.to('#navigation_panel', {
            duration: 0,
            visibility: 'visible',
            opacity: 1,
            ease: 'power2.inOut'
          });
          gsap.to('#layers_panel', {
            duration: 0,
            visibility: 'hidden',
            opacity: 1,
            ease: 'power2.inOut'
          });
          break;
      }
    },
    hidePanel() {
      gsap.to('#navigation_panel', {
        duration: 0,
        visibility: 'hidden',
        opacity: 1,
        ease: 'power2.inOut'
      });
      gsap.to('#layers_panel', {
        duration: 0,
        visibility: 'hidden',
        opacity: 1,
        ease: 'power2.inOut'
      });
    },
    showBuildingToBuildingPanel() {
      gsap.to('#buildingToBuilding_panel', {
        duration: 0,
        display: 'flex',
        ease: 'power2.inOut'
      });
      gsap.to('#userToBuilding_panel', {
        duration: 0,
        display: 'none',
        ease: 'power2.inOut'
      });
      gsap.to('#buildingToBuilding', {
        duration: 0,
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        color: 'white',
        ease: 'power2.inOut'
      });
      gsap.to('#userToBuilding', {
        duration: 0,
        backgroundColor: '#0d6efd',
        borderColor: '#0d6efd',
        color: 'white',
        ease: 'power2.inOut'
      });
    },
    showUserToBuildingPanel() {
      gsap.to('#userToBuilding_panel', {
        duration: 0,
        display: 'flex',
        ease: 'power2.inOut'
      });
      gsap.to('#buildingToBuilding_panel', {
        duration: 0,
        display: 'none',
        ease: 'power2.inOut'
      });
      gsap.to('#userToBuilding', {
        duration: 0,
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        color: 'white',
        ease: 'power2.inOut'
      });
      gsap.to('#buildingToBuilding', {
        duration: 0,
        backgroundColor: '#0d6efd',
        borderColor: '#0d6efd',
        color: 'white',
        ease: 'power2.inOut'
      });
    },
    routeFinder,
    changeBaseMap,
    userRouteFinder
  },
}

</script>

<template>
  <div id="map" @click="hidePanel"></div>
  <div id="layer_picker" @click="showPanel('layers')">
    <img src="../assets/layers-svgrepo-com.svg">
  </div>
  <div id="navigation_picker" @click="showPanel('navigation')">
    <img src="../assets/route-svgrepo-com.svg">
  </div>
  <div id="layers_panel">
    <span><b>Mapy podkładowe:</b></span>
    <span>
      <input type="radio" name="basemapLayer" @click="changeBaseMap" value="OpenStreetMap" id="OpenStreetMap" class="form-check-input" checked>
      <label for="OpenStreetMap" class="form-check-label"> &nbsp; OpenStreetMap</label>
    </span>
    <span>
      <input type="radio" name="basemapLayer" @click="changeBaseMap" value="Hybrid" id="Hybrid" class="form-check-input">
      <label for="Hybrid" class="form-check-label"> &nbsp; Mapa hybrydowa</label>
    </span>
    <span>
      <input type="radio" name="basemapLayer" @click="changeBaseMap" value="Satellite" id="Satellite" class="form-check-input">
      <label for="Satellite" class="form-check-label"> &nbsp; Satelita</label>
    </span>
    <span>
      <input type="radio" name="basemapLayer" @click="changeBaseMap" value="Traffic" id="Traffic" class="form-check-input">
      <label for="Traffic" class="form-check-label"> &nbsp; Natężenie ruchu Google</label>
    </span>
    <span>
      <input type="radio" name="basemapLayer" @click="changeBaseMap" value="GoogleTerrainMap" id="GoogleTerrain" class="form-check-input">
      <label for="GoogleTerrainMap" class="form-check-label"> &nbsp; Google Maps</label>
    </span>
  </div>
  <div id="navigation_panel">
    <div id="menu">
      <button class="btn btn-primary" id="buildingToBuilding" @click="showBuildingToBuildingPanel">Budynek - Budynek</button>
      <button class="btn btn-primary" id="userToBuilding" @click="showUserToBuildingPanel">Użytkownik - Budynek</button>
    </div>
    <div id="buildingToBuilding_panel">
      <span>Wybierz punkt początkowy</span>
      <select class="form-select-sm mb-1 startChoice" v-model="selectedStartBuilding">
        <option value="">Wybierz budynek</option>
        <option 
            v-for="building in buildings" 
            :key="building.code" 
            :value="building.code"
        >
        {{ building.code +" - "+ building.name }}
        </option>
      </select>
      <span>Wybierz punkt końcowy</span>
      <select class="form-select-sm mb-1 endChoice" v-model="selectedEndBuilding">
          <option value="">Wybierz budynek</option>
          <option 
          v-for="building in buildings" 
          :key="building.code" 
          :value="building.code"
          >
          {{ building.code +" - "+ building.name }}
          </option>
      </select>
      <span>Wybierz rodzaj transportu</span>
      <label class="form-check-label"><input type="radio" name="transportTypeRadio" value="bikeFoot" class="bikeFoot form-check-input" checked>Pieszo/Rowerem</label>
      <label class="form-check-label"><input type="radio" name="transportTypeRadio" value="car" class="car form-check-input">Samochodem</label>
      <button class="btn btn-secondary" @click="routeFinder" type="button">Sprawdź trasę</button>
    </div>
    <div id="userToBuilding_panel">
      <span class="lead">Wybierz budynek</span>
        <select class="form-select-sm mb-1 userEndChoice" v-model="selectedEndBuilding">
            <option value="">Wybierz budynek</option>
            <option 
            v-for="building in buildings" 
            :key="building.code" 
            :value="building.code"
            >
            {{ building.code +" - "+ building.name }}
            </option>
        </select>
        <br>
        <span class="lead">Wybierz rodzaj transportu</span>
        <label class="form-check-label"><input type="radio" name="userTransportTypeRadio" value="bikeFoot" class="bikeFoot form-check-input" checked>Pieszo/Rowerem</label>
        <label class="form-check-label"><input type="radio" name="userTransportTypeRadio" value="car" class="car form-check-input">Samochodem</label>
        <br>
        <button class="btn btn-secondary" @click="userRouteFinder">Pokaż trasę</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  #map {
    width: 100%;
    height: 100vh;
  }

  #navigation_picker {
    position: absolute;
    top: 10px;
    right: 61px;
    z-index: 1000;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 2px;
    outline: 2px solid rgba(173,171,171,125);
    background-color: white;

    &:hover {
      background-color: #dfdfdf;
    }

    img{
      width: 100%;
      height: 100%;
    }
  }
  #layer_picker {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 2px;
    outline: 2px solid rgba(173,171,171,125);
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #dfdfdf;
    }

    img{
      width: 90%;
      height: 90%;
    }
  }

  #navigation_panel {
    position: absolute;
    top: 55px;
    right: 10px;
    z-index: 1000;
    width: 300px;
    height: auto;
    background-color: white;
    border-radius: 2px;
    outline: 2px solid rgba(173,171,171,125);
    visibility: hidden;

    #menu{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;
      width: 100%;
      height: 100%;
    }

    #buildingToBuilding_panel{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;
      width: 100%;
      height: 100%;
      display: none;
    }
    #userToBuilding_panel{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;
      width: 100%;
      height: 100%;
      display: none;
    }
  }
  #layers_panel {
    position: absolute;
    top: 55px;
    right: 10px;
    z-index: 1000;
    width: auto;
    height: auto;
    padding: 5px;
    background-color: white;
    border-radius: 2px;
    outline: 2px solid rgba(173,171,171,125);
    display: flex;
    flex-direction: column;
    visibility: hidden;

    span input[type='radio']{
      outline: 1px solid rgba(0, 0, 0, 0.26)
    }
  }
 
</style>
