class MapView {
    constructor(engine, canvas) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 300, new BABYLON.Vector3(0, 0, 0), this.scene);
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    setup() {
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
        earthMaterial.bumpTexture = new BABYLON.Texture('../textures/planets/earth_bump2.jpg', scene);

        sphere.material = earthMaterial;

        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }

    teardown() {
        this.scene.dispose();
    }
}

export {MapView}