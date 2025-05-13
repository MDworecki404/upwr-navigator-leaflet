import { map } from "./displayMap";
import BuildingData from '../data/universityBuildings.json';
import L from "leaflet";
import { currentRouteLayer, clearRouteLayer, drawRoute } from "./displayMap";
import gsap from "gsap";

let activeWorker = null;

const getCurrentPosition = () => {

    return new Promise((resolve, reject) => {
        // Wymuś świeżą lokalizację przez opcje
        const options = {
            enableHighAccuracy: true,
            maximumAge: 0,    // Ważne: nie używaj buforowanych danych
            timeout: 10000    // Timeout po 10 sekundach
        };
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

const userRouteFinder = async () => {
    console.log('🚀 Uruchomiono funkcję routeFinder');
    
    clearRouteLayer();

    if (activeWorker) {
        activeWorker.terminate();
        activeWorker = null;
    }

    gsap.fromTo('#loadingCircle',
        { visibility: 'visible', rotation: 0 },
            {
                rotation: 360,
                repeat: -1,
                ease: "steps(12)", // 360 / 45 = 8 kroków
                duration: 2       // czas jednego pełnego obrotu, możesz dostosować
            }
    );

    let startNode = [];
    try {
        const position = await getCurrentPosition();
        startNode = [position.coords.longitude, position.coords.latitude];
        console.log('Pobrano pozycję startową:', startNode);
    } catch (error) {
        console.error("Nie udało się pobrać lokalizacji:", error);
        gsap.to('#loadingCircle', {visibility: 'hidden'})
        alert("Nie udało się pobrać lokalizacji. Sprawdź uprawnienia lub spróbuj ponownie.");
        return;
    }
    
    const endChoice = document.querySelector('.userEndChoice').value;
    if (!endChoice) {
        console.error("Nie wybrano budynku docelowego");
        gsap.to('#loadingCircle', {visibility: 'hidden'})
        alert("Wybierz budynek docelowy");
        return;
    }

    let endNode;
    for (let building of BuildingData.buildings) {
        if (building[0].code === endChoice) {
            endNode = building[0].node;
            break; // Dodaj break po znalezieniu, dla optymalizacji
        }
    }

    try {
        const network = await import('../layers/osm_wroclaw_roads.json');
        const selectedMode = document.querySelector('input[name="transportTypeRadio"]:checked').value;

        activeWorker = new Worker(new URL('./pathWorker.js', import.meta.url), { type: 'module' });

        const workerTimeout = setTimeout(() => {
            if (activeWorker) {
                console.warn("Worker timeout - przerywanie");
                activeWorker.terminate();
                activeWorker = null;
                gsap.to('#loadingCircle', {visibility: 'hidden'})
                alert("Obliczanie trasy zajęło zbyt dużo czasu. Spróbuj ponownie.");
            }
        }, 30000);

        activeWorker.postMessage({
            start: startNode,
            goal: endNode,
            network: network.default,
            mode: selectedMode,
        });

        activeWorker.onmessage = function(e) {
            clearTimeout(workerTimeout);
            const { path } = e.data;

            if (!path || path.length === 0) {
                console.warn("Brak trasy.");
                alert("Nie udało się znaleźć trasy. Spróbuj z innymi budynkami lub rodzajem transportu.");
                activeWorker.terminate();
                activeWorker = null;
                gsap.to('#loadingCircle', {visibility: 'hidden'})
                return;
            }

            // Rysowanie trasy
            const latlngs = path.map(coord => [coord[1], coord[0]]);
            drawRoute(latlngs);

            activeWorker.terminate();
            activeWorker = null;
            gsap.to('#loadingCircle', {visibility: 'hidden'})
        };

        activeWorker.onerror = function(error) {
            clearTimeout(workerTimeout);
            console.error("Błąd workera:", error);
            gsap.to('#loadingCircle', {visibility: 'hidden'})
            alert("Wystąpił błąd podczas wyszukiwania trasy. Spróbuj ponownie.");
            activeWorker.terminate();
            activeWorker = null;
        };
    } catch (error) {
        console.error("Błąd podczas wyszukiwania trasy:", error);
        alert("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
    }
};

export default userRouteFinder;
