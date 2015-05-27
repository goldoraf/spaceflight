(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var PartsWarehouse = (function () {
    function PartsWarehouse() {
        _classCallCheck(this, PartsWarehouse);

        this.packages = [{
            name: "Jupiter",
            folder: "Jupiter",
            meshFile: "rocket.babylon",
            parts: [{
                name: "CommandModule",
                meshName: "Capsule",
                nodes: {
                    top: [0, 1, 0],
                    bottom: [0, -1, 0]
                }
            }, {
                name: "J1",
                meshName: "Stage",
                nodes: {
                    top: [0, 3.5, 0],
                    bottom: [0, -3.5, 0],
                    left: [1, 0, 0],
                    right: [-1, 0, 0],
                    front: [0, 0, -1],
                    back: [0, 0, 1] }
            }, {
                name: "H1",
                meshName: "Engine",
                nodes: {
                    top: [0, 0.13, 0],
                    bottom: [0, -1.1, 0]
                }
            }]
        }];
    }

    _prototypeProperties(PartsWarehouse, null, {
        getPartMetadata: {
            value: function getPartMetadata(partName) {
                return this.parts[this.getPartIndex(partName)];
            },
            writable: true,
            configurable: true
        },
        getPartClone: {
            value: function getPartClone(partName, newName, parent) {
                return this.meshes[this.getPartIndex(partName)].clone(newName, parent);
            },
            writable: true,
            configurable: true
        },
        loadIntoScene: {
            value: function loadIntoScene(scene, callback) {
                this.parts = [];
                this.index = [];
                this.meshes = [];

                this.packages.forEach(function (pkg) {
                    var that = this;
                    BABYLON.SceneLoader.ImportMesh("", "../parts/" + pkg.folder + "/", pkg.meshFile, scene, function (newMeshes, particleSystems) {
                        pkg.parts.forEach(function (part) {
                            var potentialMesh = newMeshes.filter(function (m) {
                                return m.name == part.meshName;
                            }).shift();
                            if (potentialMesh !== undefined) {
                                potentialMesh.visibility = 0;
                                that.addPart(pkg.name + "_" + part.name, part, potentialMesh);
                            }
                        });
                        callback();
                    });
                }, this);
            },
            writable: true,
            configurable: true
        },
        addPart: {
            value: function addPart(name, properties, mesh) {
                mesh.id = mesh.name = name;
                this.parts.push({
                    name: name,
                    nodes: properties.nodes || {}
                });
                this.index.push(name);
                this.meshes.push(mesh);
            },
            writable: true,
            configurable: true
        },
        getPartIndex: {
            value: function getPartIndex(partName) {
                if (this.index.indexOf(partName) === -1) {
                    throw "Part not found: " + partName;
                }
                return this.index.indexOf(partName);
            },
            writable: true,
            configurable: true
        }
    });

    return PartsWarehouse;
})();

exports.PartsWarehouse = PartsWarehouse;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}],2:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EngineExhaust = require("./fx/EngineExhaust").EngineExhaust;
var Vehicle = (function () {
    function Vehicle(config) {
        _classCallCheck(this, Vehicle);

        this.config = config;
        this.parts = {};
        this.exhaust = null;
    }

    _prototypeProperties(Vehicle, null, {
        assemble: {
            value: function assemble(scene, warehouse) {
                this.instantiateParts(warehouse);
                this.assembleParts();
                this.attachEngineExhaust(scene);
            },
            writable: true,
            configurable: true
        },
        ignite: {
            value: function ignite() {
                this.exhaust.start();
            },
            writable: true,
            configurable: true
        },
        attachEngineExhaust: {
            value: function attachEngineExhaust(scene) {
                this.exhaust = new EngineExhaust(scene, this.parts.Jupiter_J11.mesh);
            },
            writable: true,
            configurable: true
        },
        instantiateParts: {
            value: function instantiateParts(warehouse) {
                this.config.parts.forEach(function (part) {
                    part.meta = warehouse.getPartMetadata(part.part), part.mesh = warehouse.getPartClone(part.part, part.name);

                    part.mesh.position.x = 0;
                    part.mesh.position.y = 0;
                    part.mesh.position.z = 0;

                    part.mesh.visibility = 1;

                    this.parts[part.name] = part;
                }, this);
            },
            writable: true,
            configurable: true
        },
        assembleParts: {
            value: function assembleParts() {
                this.config.parts.forEach(function (cfg) {
                    if (cfg.link === undefined) return;
                    ["top", "bottom"].forEach(function (placement) {
                        if (cfg.link[placement]) {
                            var part = this.parts[cfg.name],
                                childPart = this.parts[cfg.link[placement]];

                            childPart.mesh.parent = part.mesh;
                            switch (placement) {
                                case "bottom":
                                    childPart.mesh.position.y = part.meta.nodes.bottom[1] - childPart.meta.nodes.top[1];
                                    break;
                            }
                        }
                    }, this);
                }, this);
            },
            writable: true,
            configurable: true
        }
    });

    return Vehicle;
})();

exports.Vehicle = Vehicle;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"./fx/EngineExhaust":4}],3:[function(require,module,exports){
"use strict";

var VehicleView = require("./views/VehicleView").VehicleView;
var AssemblyView = require("./views/AssemblyView").AssemblyView;
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

document.getElementById("assemblyBtn").addEventListener("click", function (e) {
    e.preventDefault();
    currentView.teardown();
    currentView = new AssemblyView(engine, canvas);
    currentView.setup();
});

currentView = new VehicleView(engine, canvas);
currentView.setup();

window.addEventListener("resize", function () {
    engine.resize();
});

},{"./views/AssemblyView":5,"./views/MapView":6,"./views/VehicleView":7}],4:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EngineExhaust = (function () {
    function EngineExhaust(scene, engineMesh) {
        _classCallCheck(this, EngineExhaust);

        this.particles = [];
        this.particles.push(this.mainExhaust(scene, engineMesh));
        this.particles.push(this.secondaryExhaust(scene, engineMesh));
        this.particles.push(this.smoke(scene, engineMesh));
    }

    _prototypeProperties(EngineExhaust, null, {
        start: {
            value: function start() {
                this.particles.forEach(function (particleSystem) {
                    particleSystem.start();
                });
            },
            writable: true,
            configurable: true
        },
        mainExhaust: {
            value: function mainExhaust(scene, engineMesh) {
                var particleSystem = new BABYLON.ParticleSystem("mainExhaust", 5000, scene);
                particleSystem.particleTexture = new BABYLON.Texture("../textures/particles/flare.png", scene);
                // Colors of all particles
                //particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
                //particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
                //particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

                // Size of each particle (random between...
                particleSystem.minSize = 0.5;
                particleSystem.maxSize = 1;

                // Life time of each particle (random between...
                particleSystem.minLifeTime = 0.3;
                particleSystem.maxLifeTime = 1;

                // Emission rate
                particleSystem.emitRate = 3000;

                // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
                particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

                // Set the gravity of all particles
                particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

                // Direction of each particle after it has been emitted
                particleSystem.direction1 = new BABYLON.Vector3(0, -8, 0);
                particleSystem.direction2 = new BABYLON.Vector3(0, -8, 0);

                // Angular speed, in radians
                particleSystem.minAngularSpeed = 0;
                particleSystem.maxAngularSpeed = Math.PI;

                // Speed
                particleSystem.minEmitPower = 1;
                particleSystem.maxEmitPower = 3;
                particleSystem.updateSpeed = 0.005;

                particleSystem.emitter = engineMesh;
                particleSystem.minEmitBox = new BABYLON.Vector3(0, -5, 0); // Starting all from
                particleSystem.maxEmitBox = new BABYLON.Vector3(0, -5, 0);

                return particleSystem;
            },
            writable: true,
            configurable: true
        },
        secondaryExhaust: {
            value: function secondaryExhaust(scene, engineMesh) {
                var particleSystem = new BABYLON.ParticleSystem("secondaryExhaust", 5000, scene);
                particleSystem.particleTexture = new BABYLON.Texture("../textures/particles/flare.png", scene);
                // Colors of all particles
                //particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
                //particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
                //particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

                // Size of each particle (random between...
                particleSystem.minSize = 0.5;
                particleSystem.maxSize = 1;

                // Life time of each particle (random between...
                particleSystem.minLifeTime = 0.1;
                particleSystem.maxLifeTime = 0.5;

                // Emission rate
                particleSystem.emitRate = 3000;

                // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
                particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

                // Set the gravity of all particles
                particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

                // Direction of each particle after it has been emitted
                particleSystem.direction1 = new BABYLON.Vector3(0, -8, 0);
                particleSystem.direction2 = new BABYLON.Vector3(0, -8, 0);

                // Angular speed, in radians
                particleSystem.minAngularSpeed = 0;
                particleSystem.maxAngularSpeed = Math.PI;

                // Speed
                particleSystem.minEmitPower = 10;
                particleSystem.maxEmitPower = 30;
                particleSystem.updateSpeed = 0.005;

                particleSystem.emitter = engineMesh;
                particleSystem.minEmitBox = new BABYLON.Vector3(0, -5, 0); // Starting all from
                particleSystem.maxEmitBox = new BABYLON.Vector3(0, -5, 0);

                return particleSystem;
            },
            writable: true,
            configurable: true
        },
        smoke: {
            value: function smoke(scene, engineMesh) {
                var particleSystem = new BABYLON.ParticleSystem("smoke", 2000, scene);
                particleSystem.particleTexture = new BABYLON.Texture("../textures/particles/smoke.png", scene);

                particleSystem.minSize = 0.5;
                particleSystem.maxSize = 2;

                particleSystem.minLifeTime = 1;
                particleSystem.maxLifeTime = 2.5;

                particleSystem.emitRate = 300;

                // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
                particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

                // Set the gravity of all particles
                particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

                // Direction of each particle after it has been emitted
                particleSystem.direction1 = new BABYLON.Vector3(0, -8, 0);
                particleSystem.direction2 = new BABYLON.Vector3(0, -8, 0);

                // Angular speed, in radians
                particleSystem.minAngularSpeed = 0;
                particleSystem.maxAngularSpeed = Math.PI;

                // Speed
                particleSystem.minEmitPower = 100;
                particleSystem.maxEmitPower = 300;
                particleSystem.updateSpeed = 0.005;

                particleSystem.emitter = engineMesh;
                particleSystem.minEmitBox = new BABYLON.Vector3(0, -8, 0); // Starting all from
                particleSystem.maxEmitBox = new BABYLON.Vector3(0, -8, 0);

                return particleSystem;
            },
            writable: true,
            configurable: true
        }
    });

    return EngineExhaust;
})();

exports.EngineExhaust = EngineExhaust;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}],5:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var PartsWarehouse = require("../PartsWarehouse").PartsWarehouse;
var AssemblyView = (function () {
    function AssemblyView(engine, canvas) {
        _classCallCheck(this, AssemblyView);

        this.engine = engine;
        this.canvas = canvas;
        this.scene = new BABYLON.Scene(engine);
        this.warehouse = new PartsWarehouse();

        this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera.setPosition(new BABYLON.Vector3(2, 20, 40));
        this.camera.attachControl(this.canvas, true);

        this.ground = BABYLON.Mesh.CreateGround("ground", 50, 50, 1, this.scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        this.ground.material = groundMaterial;

        this.activePart = null;
        this.dragStartingPoint = null;
    }

    _prototypeProperties(AssemblyView, null, {
        setup: {
            value: function setup() {
                var scene = this.scene;

                this.warehouse.loadIntoScene(scene, this.onReady.bind(this));

                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                light.intensity = 0.7;

                this.engine.runRenderLoop(function () {
                    scene.render();
                });
            },
            writable: true,
            configurable: true
        },
        onReady: {
            value: function onReady() {
                var _this = this;
                var scene = this.scene;

                this.warehouse.parts.map(function (p) {
                    return p.name;
                }).forEach(function (name, i) {
                    return _this.pickPart(name, new BABYLON.Vector3(i * 10, 10, 0));
                }, this);

                this.listeners = {
                    down: this.onPointerDown.bind(this),
                    up: this.onPointerUp.bind(this),
                    move: this.onPointerMove.bind(this)
                };
                this.canvas.addEventListener("pointerdown", this.listeners.down, false);
                this.canvas.addEventListener("pointerup", this.listeners.up, false);
                this.canvas.addEventListener("pointermove", this.listeners.move, false);

                this.canvas.oncontextmenu = function () {
                    return false;
                };
            },
            writable: true,
            configurable: true
        },
        pickPart: {
            value: function pickPart(partName, position) {
                var mesh = this.warehouse.getPartClone(partName, partName + "1");
                mesh.position = position;
                mesh.visibility = 0.5;

                mesh.actionManager = new BABYLON.ActionManager(this.scene);
                var highlightCondition = new BABYLON.PredicateCondition(mesh.actionManager, function () {
                    return mesh.visibility == 1;
                });
                mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.Red(), !highlightCondition));
                mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.Green(), highlightCondition));
                mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
            },
            writable: true,
            configurable: true
        },
        getGroundPosition: {
            value: function getGroundPosition(evt) {
                var ground = this.ground,
                    pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) {
                    return mesh == ground;
                });

                return pickInfo.hit ? pickInfo.pickedPoint : null;
            },
            writable: true,
            configurable: true
        },
        getPickedPart: {
            value: function getPickedPart(evt) {
                // check if we are under a mesh
                // TODO: check that the picked mesh is a part and not a mesh from the VAB scene
                var ground = this.ground,
                    pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) {
                    return mesh !== ground;
                });

                return pickInfo.hit ? pickInfo.pickedMesh : null;
            },
            writable: true,
            configurable: true
        },
        activatePart: {
            value: function activatePart(part) {
                this.desactivatePart(this.activePart);
                this.activePart = part;
                part.visibility = 1;
                if (!part.nodeMeshes) part.nodeMeshes = [];

                var scene = this.scene,
                    meta = this.warehouse.getPartMetadata(part.name.slice(0, -1)); // TODO: all parts are suffixed with '1'. Not ideal...

                ["top", "bottom", "left", "right", "front", "back"].forEach(function (placement) {
                    if (meta.nodes[placement]) {
                        var sphere = BABYLON.Mesh.CreateSphere(part.name + "_" + placement + "_node", 10, 1, scene);
                        sphere.parent = part;
                        sphere.position.x = meta.nodes[placement][0];
                        sphere.position.y = meta.nodes[placement][1];
                        sphere.position.z = meta.nodes[placement][2];
                        part.nodeMeshes.push(sphere);
                    }
                });
            },
            writable: true,
            configurable: true
        },
        desactivatePart: {
            value: function desactivatePart(part) {
                if (!part) {
                    return;
                }part.visibility = 0.5;
                part.nodeMeshes.forEach(function (node) {
                    return node.dispose();
                });
            },
            writable: true,
            configurable: true
        },
        onPointerDown: {
            value: function onPointerDown(evt) {
                if (evt.button != 0 && evt.button != 2) {
                    return;
                }
                this.current_button = evt.button; // Save button for Y translation use

                var pickedPart = this.getPickedPart(evt);
                if (pickedPart) {
                    this.activatePart(pickedPart);
                    this.setupPartDrag(evt);
                }
            },
            writable: true,
            configurable: true
        },
        setupPartDrag: {
            value: function setupPartDrag(evt) {
                this.dragStartingPoint = this.getGroundPosition(evt);
                if (this.dragStartingPoint) {
                    // we need to disconnect camera from canvas
                    var camera = this.camera,
                        canvas = this.canvas;
                    setTimeout(function () {
                        camera.detachControl(canvas);
                    }, 0);
                }
            },
            writable: true,
            configurable: true
        },
        isDragging: {
            value: function isDragging() {
                return this.dragStartingPoint !== null;
            },
            writable: true,
            configurable: true
        },
        onPointerUp: {
            value: function onPointerUp() {
                if (this.isDragging()) {
                    this.onDrop();
                    return;
                }
            },
            writable: true,
            configurable: true
        },
        onDrop: {
            value: function onDrop() {
                this.camera.attachControl(this.canvas);
                this.dragStartingPoint = null;
            },
            writable: true,
            configurable: true
        },
        onPointerMove: {
            value: function onPointerMove(evt) {
                if (!this.isDragging()) {
                    return;
                }

                this.onDrag(evt);
            },
            writable: true,
            configurable: true
        },
        onDrag: {
            value: function onDrag(evt) {
                var current = this.getGroundPosition(evt);
                if (!current) {
                    return;
                }if (this.current_button == 0) {
                    var diff = current.subtract(this.dragStartingPoint);
                    this.activePart.position.addInPlace(diff);
                    this.dragStartingPoint = current;
                } else if (this.current_button == 2 && current.x > 0) {
                    // TODO: replace this nasty code for better ground colision detect
                    this.activePart.position.y = current.x; // Set the Y translation with X value, for better maniability
                }
            },
            writable: true,
            configurable: true
        },
        teardown: {
            value: function teardown() {
                this.canvas.removeEventListener("pointerdown", this.listeners.down);
                this.canvas.removeEventListener("pointerup", this.listeners.up);
                this.canvas.removeEventListener("pointermove", this.listeners.move);
            },
            writable: true,
            configurable: true
        }
    });

    return AssemblyView;
})();

exports.AssemblyView = AssemblyView;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../PartsWarehouse":1}],6:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}],7:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Vehicle = require("../Vehicle").Vehicle;
var PartsWarehouse = require("../PartsWarehouse").PartsWarehouse;
var VehicleView = (function () {
    function VehicleView(engine, canvas) {
        _classCallCheck(this, VehicleView);

        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);

        this.warehouse = new PartsWarehouse();
        this.vehicle = new Vehicle({
            name: "Jupiter C",
            parts: [{
                name: "Jupiter_CommandModule1",
                part: "Jupiter_CommandModule",
                link: {
                    bottom: "Jupiter_J11"
                }
            }, {
                name: "Jupiter_J11",
                part: "Jupiter_J1",
                link: {
                    bottom: "Jupiter_H11"
                }
            }, {
                name: "Jupiter_H11",
                part: "Jupiter_H1"
            }]
        });

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), this.scene);
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    _prototypeProperties(VehicleView, null, {
        setup: {
            value: function setup() {
                var scene = this.scene,
                    vehicle = this.vehicle,
                    warehouse = this.warehouse;

                warehouse.loadIntoScene(scene, function () {
                    vehicle.assemble(scene, warehouse);
                    vehicle.ignite();
                });

                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                // Default intensity is 1. Let's dim the light a small amount
                light.intensity = 0.7;

                this.addAxis(scene);
                this.addSkydome(scene);
                this.addLaunchpad(scene);

                //scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());

                this.engine.runRenderLoop(function () {
                    scene.render();
                });
            },
            writable: true,
            configurable: true
        },
        addAxis: {
            value: function addAxis(scene) {
                var xAxis = BABYLON.Mesh.CreateLines("xAxis", [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(10, 0, 0)], scene);
                var yAxis = BABYLON.Mesh.CreateLines("yAxis", [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 10, 0)], scene);
                var zAxis = BABYLON.Mesh.CreateLines("zAxis", [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 10)], scene);
                xAxis.color = new BABYLON.Color3(255, 0, 0);
            },
            writable: true,
            configurable: true
        },
        addSkydome: {
            value: function addSkydome(scene) {
                BABYLON.Engine.ShadersRepository = "../shaders/";

                var skybox = BABYLON.Mesh.CreateSphere("skydome", 10, 2500, scene);

                var shader = new BABYLON.ShaderMaterial("skydome", scene, "skydome", {});
                shader.setFloat("offset", 0);
                shader.setFloat("exponent", 0.6);
                shader.setColor3("topColor", BABYLON.Color3.FromInts(0, 119, 255));
                shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240, 240, 255));
                shader.backFaceCulling = false;
                skybox.material = shader;
            },
            writable: true,
            configurable: true
        },
        addLaunchpad: {
            value: function addLaunchpad(scene) {
                var mat = new BABYLON.StandardMaterial("ground", scene);
                var t = new BABYLON.Texture("../textures/launchpad.jpg", scene);
                t.uScale = t.vScale = 10;
                mat.diffuseTexture = t;
                mat.specularColor = BABYLON.Color3.Black();

                var g = BABYLON.Mesh.CreateBox("ground", 400, scene);
                g.position.y = -12;
                g.scaling.y = 0.01;

                g.material = mat;
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
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../PartsWarehouse":1,"../Vehicle":2}]},{},[3]);
