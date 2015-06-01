import {EngineExhaust} from './fx/EngineExhaust';

const Situations = {
    PRELAUNCH: 0,
    FLYING: 1,
    LANDED: 2,
    SPLASHED: 3,
    SUBORBITAL: 4,
    ORBITING: 5,
    ESCAPING: 6,
    DOCKED: 7
}

class Vehicle {
    constructor(config) {
        this.config = config;
        this.parts = [];
        this.exhaust = null;
        this.situation = Situations.PRELAUNCH;
    }

    assemble(scene, warehouse) {
        this.instantiateParts(warehouse);
        this.assembleParts();
        this.attachEngineExhaust(scene);
        scene.createCompoundImpostor({
            mass: 2, friction: 0.4, restitution: 0.3, parts: this.parts
        });
    }

    update() {
        if (this.situation === Situations.FLYING) this.applyThrust();
    }

    toggleThrust() {
        this.situation === Situations.FLYING ? this.cutoff() : this.ignite();
    }

    ignite() {
        this.situation = Situations.FLYING;
        this.exhaust.start();
    }

    cutoff() {
        this.situation = Situations.SUBORBITAL;
        this.exhaust.stop();
    }

    attachEngineExhaust(scene) {
        this.exhaust = new EngineExhaust(scene, this.parts[1].mesh);
    }

    applyThrust() {
        var thrustPlateTank = this.parts[1].mesh,
            thrustPlatePosition = thrustPlateTank.position;
console.log(thrustPlateTank);
        thrustPlateTank.applyImpulse(new BABYLON.Vector3(0, 2, 0), thrustPlatePosition);
    }

    instantiateParts(warehouse) {
        this.config.parts.forEach(function(part) {
            part.meta = warehouse.getPartMetadata(part.part),
            part.mesh = warehouse.getPartClone(part.part, part.name);

            part.impostor = BABYLON.PhysicsEngine.BoxImpostor;

            part.mesh.position.x = 0;
            part.mesh.position.y = 0;
            part.mesh.position.z = 0;

            part.mesh.visibility = 1.0;

            this.parts.push(part);
        }, this);
    }

    assembleParts() {
        this.config.parts.forEach(function(cfg, idx) {
            if (cfg.link === undefined) return;
            ['top', 'bottom'].forEach(function(placement) {
                if (cfg.link[placement]) {
                    var part = this.getPartByID(cfg.name),
                        childPart = this.getPartByID(cfg.link[placement]);
                    
                    childPart.mesh.parent = part.mesh;
                    switch(placement) {
                        case 'bottom':
                            childPart.mesh.position.y = part.meta.nodes.bottom[1] - childPart.meta.nodes.top[1];
                            break;
                    }
                }
            }, this);
        }, this);
    }

    getPartByID(id) {
        return this.parts.filter(part => part.name === id).shift();
    }
}

export {Vehicle};