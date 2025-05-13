import { map } from "./displayMap";
import BuildingData from '../data/universityBuildings.json';
import L from "leaflet";
import { currentRouteLayer, clearRouteLayer, drawRoute  } from "./displayMap";
import gsap from "gsap";

let activeWorker = null;

const routeFinder = async () => {

    console.log('🚀 Uruchomiono funkcję routeFinder');
    
    clearRouteLayer();

    if (activeWorker) {
        activeWorker.terminate();
        activeWorker = null;
    }

    const startChoice = document.querySelector('.startChoice').value;
    const endChoice = document.querySelector('.endChoice').value;

    if (!startChoice || !endChoice) {
        console.error("Nie wybrano budynków");
        alert("Wybierz budynki początkowy i docelowy");
        return;
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
    let startNode, endNode;

    for (let building of BuildingData.buildings) {
        if (building[0].code === startChoice) {
            startNode = building[0].node;
        }
        if (building[0].code === endChoice) {
            endNode = building[0].node;
        }
        if (startNode && endNode) break;
    }

    if (!startNode || !endNode) {
        console.error("Nie znaleziono wybranych budynków.");
        alert("Nie znaleziono wybranych budynków. Spróbuj ponownie wybrać budynki.");
        gsap.to('#loadingCircle', {visibility: 'hidden'})
        return;
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
                gsap.to('#loadingCircle', {visibility: 'hidden'})
                alert("Nie udało się znaleźć trasy. Spróbuj z innymi budynkami lub rodzajem transportu.");
                activeWorker.terminate();
                activeWorker = null;
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

export default routeFinder;
