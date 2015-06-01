import {Vehicle} from '../Vehicle';
import {PartsWarehouse} from '../PartsWarehouse';

class VehicleView {
    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        
        this.scene = new BABYLON.Scene(engine);
        this.scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());

        this.warehouse = new PartsWarehouse();
        this.vehicle = new Vehicle({
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
        });
    }

    setup() {
        var that = this;
        this.warehouse.loadIntoScene(this.scene, function() {
            that.realSetup();
        });        
    }

    realSetup() {
        var scene = this.scene,
            canvas = this.canvas,
            vehicle = this.vehicle;

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);


        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        this.addAxis(scene);
        this.addSkydome(scene);
        this.addLaunchpad(scene);

        vehicle.assemble(scene, this.warehouse);

        scene.registerBeforeRender(function() {
            vehicle.update();
            camera.target = vehicle.parts[0].mesh.position;
        });

        document.addEventListener('keypress', function(e) {
            console.log(e.charCode);
            switch (e.charCode) {
                case 32: // SPACE
                    vehicle.toggleThrust();
                    break;
            }
        });

        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }

    addAxis(scene) {
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
    }

    addSkydome(scene) {
        BABYLON.Engine.ShadersRepository = "../shaders/";

        var skybox = BABYLON.Mesh.CreateSphere("skydome", 10, 2500, scene);

        var shader = new BABYLON.ShaderMaterial("skydome", scene, "skydome", {});
        shader.setFloat("offset", 0);
        shader.setFloat("exponent", 0.6);
        shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
        shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));
        shader.backFaceCulling = false;
        skybox.material = shader;
    }

    addLaunchpad(scene) {
        var mat = new BABYLON.StandardMaterial("ground", scene);
        var t = new BABYLON.Texture("../textures/launchpad.jpg", scene);
        t.uScale = t.vScale = 10;
        mat.diffuseTexture = t;
        mat.specularColor = BABYLON.Color3.Black();

        var g = BABYLON.Mesh.CreateBox("ground", 400, scene);
        g.position.y = -12;
        g.scaling.y = 0.01;

        g.material = mat;

        g.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false });
    }

    teardown() {
        this.scene.dispose();
    }
}

export {VehicleView}
