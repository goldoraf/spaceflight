import {EngineExhaust} from './fx/EngineExhaust';

class Vehicle {
    constructor(config) {
        this.config = config;
        this.parts = {};
        this.exhaust = null;
    }

    assemble(scene, warehouse) {
        this.instantiateParts(warehouse);
        this.assembleParts();
        this.attachEngineExhaust(scene);
    }

    ignite() {
        this.exhaust.start();
    }

    attachEngineExhaust(scene) {
        this.exhaust = new EngineExhaust(scene, this.parts['Jupiter_J11'].mesh);
    }

    instantiateParts(warehouse) {
        this.config.parts.forEach(function(part) {
            part.meta = warehouse.getPartMetadata(part.part),
            part.mesh = warehouse.getPartClone(part.part, part.name);

            part.mesh.position.x = 0;
            part.mesh.position.y = 0;
            part.mesh.position.z = 0;

            part.mesh.visibility = 1.0;

            this.parts[part.name] = part;
        }, this);
    }

    assembleParts() {
        this.config.parts.forEach(function(cfg) {
            if (cfg.link === undefined) return;
            ['top', 'bottom'].forEach(function(placement) {
                if (cfg.link[placement]) {
                    var part = this.parts[cfg.name],
                        childPart = this.parts[cfg.link[placement]];
                    
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
}

export {Vehicle};