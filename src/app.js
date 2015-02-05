import {VehicleView} from './views/VehicleView';
import {MapView} from './views/MapView';

var currentView,
    canvas = document.getElementById('scene'),
    engine = new BABYLON.Engine(canvas, true);

document.getElementById('vehicleBtn').addEventListener('click', function(e) {
    e.preventDefault();
    currentView.teardown();
    currentView = new VehicleView(engine, canvas);
    currentView.setup();
});

document.getElementById('mapBtn').addEventListener('click', function(e) {
    e.preventDefault();
    currentView.teardown();
    currentView = new MapView(engine, canvas);
    currentView.setup();
});

currentView = new VehicleView(engine, canvas);
currentView.setup();

window.addEventListener('resize', function() {
    engine.resize();
});


