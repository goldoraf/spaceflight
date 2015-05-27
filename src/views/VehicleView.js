import {PartsWarehouse} from '../PartsWarehouse';
import {EngineExhaust} from '../fx/EngineExhaust';

class VehicleView {
    constructor(engine, canvas) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        this.warehouse = new PartsWarehouse();

        this.vehicle = {
            name: 'Jupiter C',
            parts: [
                {
                    name: 'Jupiter_CommandModule1',
                    part: 'Jupiter_CommandModule',
                    link: {
                        bottom: 'Jupiter_J11'
                    }
                },
                {
                    name: 'Jupiter_J11',
                    part: 'Jupiter_J1',
                    link: {
                        bottom: 'Jupiter_H11'
                    }
                },
                {
                    name: 'Jupiter_H11',
                    part: 'Jupiter_H1'
                }
            ]
        };
        this.index = [];
        this.vehicle.parts.forEach(function(part, i) {
            this.index[i] = part.name;
        }, this);

        this.vehicleEngine = 'Jupiter_H11';

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), this.scene);
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    recursiveBuild(part, parent, relativePlacement) {
        if (!part) {
            part = this.vehicle.parts[0];
        }

        var meta = this.warehouse.getPartMetadata(part.part),
            mesh = this.warehouse.getPartClone(part.part, part.name, parent);

        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;

        if (parent) {
            var parentPartName = this.vehicle.parts[this.index.indexOf(parent.name)].part,
                parentMeta = this.warehouse.getPartMetadata(parentPartName);

            switch(relativePlacement) {
                case 'bottom':
                    mesh.position.y = parentMeta.nodes.bottom[1] - meta.nodes.top[1];
                    break;
            }
        }

        mesh.visibility = 1.0;

        if (part.link === undefined) return;
        ['top', 'bottom'].forEach(function(placement) {
            if (part.link[placement]) {
                var childPart = this.vehicle.parts[this.index.indexOf(part.link[placement])]
                this.recursiveBuild(childPart, mesh, placement);
            }
        }, this);

        this.attachEngineExhaust();
    }

    setup() {
        var scene = this.scene;

        this.meshes = [];
        this.warehouse.loadIntoScene(scene, this.recursiveBuild.bind(this));

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        var xAxis = BABYLON.Mesh.CreateLines("xAxis", [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(10, 0, 0)
        ], scene);
        var yAxis = BABYLON.Mesh.CreateLines("yAxis", [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 10, 0)
        ], scene);
        var zAxis = BABYLON.Mesh.CreateLines("zAxis", [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 10)
        ], scene);
        xAxis.color = new BABYLON.Color3(255, 0, 0);

        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }

    attachEngineExhaust() {
        var enginePartName = this.vehicle.parts[this.index.indexOf(this.vehicleEngine)].part,
            engineMeta = this.warehouse.getPartMetadata(enginePartName),
            engineMesh = this.scene.getMeshByName(this.vehicleEngine);

        var exhaust = new EngineExhaust(this.scene, engineMesh);
    }

    teardown() {
        this.scene.dispose();
    }
}

export {VehicleView}
