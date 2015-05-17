import {PartsWarehouse} from '../PartsWarehouse';

class AssemblyView {
    constructor(engine, canvas) {
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

    setup() {
        var scene = this.scene;

        this.warehouse.loadIntoScene(scene, this.onReady.bind(this));

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }

    onReady() {
        var scene = this.scene;

        this.warehouse.parts.map(p => p.name).forEach((name, i) => this.pickPart(name, new BABYLON.Vector3(i*10, 10, 0)), this);

        this.listeners = {
            down: this.onPointerDown.bind(this),
            up: this.onPointerUp.bind(this),
            move: this.onPointerMove.bind(this)
        };
        this.canvas.addEventListener("pointerdown", this.listeners.down, false);
        this.canvas.addEventListener("pointerup", this.listeners.up, false);
        this.canvas.addEventListener("pointermove", this.listeners.move, false);

        this.canvas.oncontextmenu = function() { return false; };
    }

    pickPart(partName, position) {
        var mesh = this.warehouse.getPartClone(partName, partName + '1');
        mesh.position = position;
        mesh.visibility = 0.5;

        mesh.actionManager = new BABYLON.ActionManager(this.scene);
        var highlightCondition = new BABYLON.PredicateCondition(mesh.actionManager, function () {
            return mesh.visibility == 1.0;
        });
        mesh.actionManager.registerAction(
            new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.Red(), !highlightCondition)
        );
         mesh.actionManager.registerAction(
            new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.Green(), highlightCondition)
        );
        mesh.actionManager.registerAction(
            new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor)
        );
    }

    getGroundPosition(evt) {
        var ground = this.ground,
            pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => mesh == ground);

        return pickInfo.hit ? pickInfo.pickedPoint : null;
    }

    getPickedPart(evt) {
        // check if we are under a mesh
        // TODO: check that the picked mesh is a part and not a mesh from the VAB scene
        var ground = this.ground,
            pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => mesh !== ground);

        return pickInfo.hit ? pickInfo.pickedMesh : null;
    }

    activatePart(part) {
        this.desactivatePart(this.activePart);
        this.activePart = part;
        part.visibility = 1.0;
        if (!part.nodeMeshes) part.nodeMeshes = [];

        var scene = this.scene,
            meta = this.warehouse.getPartMetadata(part.name.slice(0, -1)); // TODO: all parts are suffixed with '1'. Not ideal...

        ['top', 'bottom', 'left', 'right', 'front', 'back'].forEach(function(placement) {
            if (meta.nodes[placement]) {
                var sphere = BABYLON.Mesh.CreateSphere(part.name + '_' + placement + '_node', 10, 1, scene);
                sphere.parent = part;
                sphere.position.x = meta.nodes[placement][0];
                sphere.position.y = meta.nodes[placement][1];
                sphere.position.z = meta.nodes[placement][2];
                part.nodeMeshes.push(sphere);
            }
        });
    }

    desactivatePart(part) {
        if (!part) return;
        part.visibility = 0.5;
        part.nodeMeshes.forEach(node => node.dispose());
    }

    onPointerDown(evt) {
        if (evt.button != 0) {
            return;
        }

        var pickedPart = this.getPickedPart(evt);
        if (pickedPart) {
            this.activatePart(pickedPart);
            this.setupPartDrag(evt);
        }
    }

    setupPartDrag(evt) {
        this.dragStartingPoint = this.getGroundPosition(evt);
        if (this.dragStartingPoint) { // we need to disconnect camera from canvas
            var camera = this.camera, canvas = this.canvas;
            setTimeout(function () {
                camera.detachControl(canvas);
            }, 0);
        }
    }

    isDragging() {
        return this.dragStartingPoint !== null;
    }

    onPointerUp() {
        if (this.isDragging()) {
            this.onDrop();
            return;
        }
    }

    onDrop() {
        this.camera.attachControl(this.canvas);
        this.dragStartingPoint = null;
    }

    onPointerMove(evt) {
        if (!this.isDragging()) {
            return;
        }

        this.onDrag(evt);
    }

    onDrag(evt) {
        var current = this.getGroundPosition(evt);
        if (!current) return;

        var diff = current.subtract(this.dragStartingPoint);
        this.activePart.position.addInPlace(diff);
        this.dragStartingPoint = current;
    }

    teardown() {
        this.canvas.removeEventListener("pointerdown", this.listeners.down);
        this.canvas.removeEventListener("pointerup", this.listeners.up);
        this.canvas.removeEventListener("pointermove", this.listeners.move);
    }
}

export {AssemblyView}