class PartsWarehouse {
    constructor() {
        this.packages = [
            {
                name: 'Jupiter',
                folder: 'Jupiter',
                meshFile: 'rocket.babylon',
                parts: [
                    {
                        name: 'CommandModule',
                        meshName: 'Capsule',
                        nodes: {
                            top: [0, 1.0, 0],
                            bottom: [0, -1.0, 0]
                        }
                    },
                    {
                        name: 'J1',
                        meshName: 'Stage',
                        nodes: {
                            top: [0, 3.5, 0],
                            bottom: [0, -3.5, 0]
                        }
                    },
                    {
                        name: 'H1',
                        meshName: 'Engine',
                        nodes: {
                            top: [0, 0.13, 0],
                            bottom: [0, -1.10, 0]
                        }
                    }
                ]
            }
        ];
    }

    getPartMetadata(partName) {
        return this.parts[this.getPartIndex(partName)];
    }

    getPartClone(partName, newName, parent) {
        return this.meshes[this.getPartIndex(partName)].clone(newName, parent);
    }

    loadIntoScene(scene, callback) {
        this.parts = [];
        this.index = [];
        this.meshes = [];

        this.packages.forEach(function(pkg) {
            var that = this;
            BABYLON.SceneLoader.ImportMesh('', '../parts/' + pkg.folder + '/', pkg.meshFile, scene, 
                                           function (newMeshes, particleSystems) {
                pkg.parts.forEach(function(part) {
                    var potentialMesh = newMeshes.filter(m => m.name == part.meshName).shift();
                    if (potentialMesh !== undefined) {
                        potentialMesh.visibility = 0;
                        that.addPart(pkg.name + '_' + part.name, part, potentialMesh);
                    }
                });
                callback();
            });
        }, this);
    }

    addPart(name, properties, mesh) {
        mesh.id = mesh.name = name;
        this.parts.push({
            name: name,
            nodes: properties.nodes || {}
        });
        this.index.push(name);
        this.meshes.push(mesh);
    }

    getPartIndex(partName) {
        if (this.index.indexOf(partName) === -1) {
            throw "Part not found: " + partName;
        }
        return this.index.indexOf(partName);
    }
}

export {PartsWarehouse}