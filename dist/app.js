(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var VehicleView = require("./views/VehicleView").VehicleView;
var MapView = require("./views/MapView").MapView;


var currentView,
    canvas = document.getElementById("scene"),
    engine = new BABYLON.Engine(canvas, true);

document.getElementById("vehicleBtn").addEventListener("click", function (e) {
    e.preventDefault();
    currentView.teardown();
    currentView = new VehicleView(engine, canvas);
    currentView.setup();
});

document.getElementById("mapBtn").addEventListener("click", function (e) {
    e.preventDefault();
    currentView.teardown();
    currentView = new MapView(engine, canvas);
    currentView.setup();
});

currentView = new VehicleView(engine, canvas);
currentView.setup();

window.addEventListener("resize", function () {
    engine.resize();
});

},{"./views/MapView":2,"./views/VehicleView":3}],2:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var MapView = (function () {
    function MapView(engine, canvas) {
        _classCallCheck(this, MapView);

        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 300, new BABYLON.Vector3(0, 0, 0), this.scene);
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    _prototypeProperties(MapView, null, {
        setup: {
            value: function setup() {
                var scene = this.scene;
                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                // Default intensity is 1. Let's dim the light a small amount
                light.intensity = 0.7;

                // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
                var sphere = BABYLON.Mesh.CreateSphere("sphere1", 100, 100, scene);

                // Move the sphere upward 1/2 its height
                sphere.position.y = 1;

                sphere.rotation.x = Math.PI;

                //Creation of a material with an image texture
                var earthMaterial = new BABYLON.StandardMaterial("texture1", scene);
                earthMaterial.diffuseTexture = new BABYLON.Texture("../textures/planets/earth_color2.jpg", scene);
                earthMaterial.bumpTexture = new BABYLON.Texture("../textures/planets/earth_bump2.jpg", scene);

                sphere.material = earthMaterial;

                this.engine.runRenderLoop(function () {
                    scene.render();
                });
            },
            writable: true,
            configurable: true
        },
        teardown: {
            value: function teardown() {
                this.scene.dispose();
            },
            writable: true,
            configurable: true
        }
    });

    return MapView;
})();

exports.MapView = MapView;
exports.__esModule = true;

},{}],3:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var VehicleView = (function () {
    function VehicleView(engine, canvas) {
        _classCallCheck(this, VehicleView);

        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), this.scene);
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    _prototypeProperties(VehicleView, null, {
        setup: {
            value: function setup() {
                var scene = this.scene;
                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                // Default intensity is 1. Let's dim the light a small amount
                light.intensity = 0.7;

                BABYLON.SceneLoader.ImportMesh("Rocket", "../meshes/", "rocket.babylon", scene, function (newMeshes, particleSystems) {
                    var rocketMesh = newMeshes[0];
                    rocketMesh.position.x = 0;
                    rocketMesh.position.y = 0;
                    rocketMesh.position.z = 0;

                    rocketMesh.showBoundingBox = true;

                    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
                    particleSystem.particleTexture = new BABYLON.Texture("../textures/particles/flare.png", scene);
                    // Colors of all particles
                    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1, 1);
                    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1);
                    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0);

                    // Size of each particle (random between...
                    particleSystem.minSize = 0.1;
                    particleSystem.maxSize = 0.5;

                    // Life time of each particle (random between...
                    particleSystem.minLifeTime = 0.3;
                    particleSystem.maxLifeTime = 1.5;

                    // Emission rate
                    particleSystem.emitRate = 1500;

                    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
                    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

                    // Set the gravity of all particles
                    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

                    // Direction of each particle after it has been emitted
                    particleSystem.direction1 = new BABYLON.Vector3(-3, -8, 3);
                    particleSystem.direction2 = new BABYLON.Vector3(3, -8, -3);

                    // Angular speed, in radians
                    particleSystem.minAngularSpeed = 0;
                    particleSystem.maxAngularSpeed = Math.PI;

                    // Speed
                    particleSystem.minEmitPower = 1;
                    particleSystem.maxEmitPower = 3;
                    particleSystem.updateSpeed = 0.005;

                    particleSystem.emitter = rocketMesh;
                    particleSystem.minEmitBox = new BABYLON.Vector3(0, -17, 0); // Starting all from
                    particleSystem.maxEmitBox = new BABYLON.Vector3(0, -17, 0); // To...

                    particleSystem.start();
                });

                var xAxis = BABYLON.Mesh.CreateLines("xAxis", [new BABYLON.Vector3(-10, 0, 0), new BABYLON.Vector3(10, 0, 0)], scene);
                var yAxis = BABYLON.Mesh.CreateLines("yAxis", [new BABYLON.Vector3(0, -10, 0), new BABYLON.Vector3(0, 10, 0)], scene);
                var zAxis = BABYLON.Mesh.CreateLines("zAxis", [new BABYLON.Vector3(0, 0, -10), new BABYLON.Vector3(0, 0, 10)], scene);

                this.engine.runRenderLoop(function () {
                    scene.render();
                });
            },
            writable: true,
            configurable: true
        },
        teardown: {
            value: function teardown() {
                this.scene.dispose();
            },
            writable: true,
            configurable: true
        }
    });

    return VehicleView;
})();

exports.VehicleView = VehicleView;
exports.__esModule = true;

},{}]},{},[1]);
