class EngineExhaust {
    constructor(scene, engineMesh) {
        this.particles = [];
        this.particles.push(this.mainExhaust(scene, engineMesh));
        this.particles.push(this.secondaryExhaust(scene, engineMesh));
        this.particles.push(this.smoke(scene, engineMesh));
    }

    start() {
        this.particles.forEach(function(particleSystem) {
            particleSystem.start();
        });
    }

    mainExhaust(scene, engineMesh) {
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
        particleSystem.maxLifeTime = 1.0;

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
    }

    secondaryExhaust(scene, engineMesh) {
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
    }

    smoke(scene, engineMesh) {
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
    }
}

export {EngineExhaust};