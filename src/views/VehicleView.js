class VehicleView {
    constructor(engine, canvas) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), this.scene);
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    setup() {
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
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

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

        var xAxis = BABYLON.Mesh.CreateLines("xAxis", [
            new BABYLON.Vector3(-10, 0, 0),
            new BABYLON.Vector3(10, 0, 0)
        ], scene);
        var yAxis = BABYLON.Mesh.CreateLines("yAxis", [
            new BABYLON.Vector3(0, -10, 0),
            new BABYLON.Vector3(0, 10, 0)
        ], scene);
        var zAxis = BABYLON.Mesh.CreateLines("zAxis", [
            new BABYLON.Vector3(0, 0, -10),
            new BABYLON.Vector3(0, 0, 10)
        ], scene);

        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }

    teardown() {
        this.scene.dispose();
    }
}

export {VehicleView}