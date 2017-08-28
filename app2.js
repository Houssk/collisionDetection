/**
 * Created by Utilisateur on 01/08/2017.
 */
/**
 * Created by Houssam on 27/07/2017.
 */
/**
 * Initialisation des variables gloables
 */

var scene;
/**
 * Camera for 4 views
 */
var camera3D;
/**
 * Renderer for 4 views
 */
var renderer3D;
/**
 * Controls
 */
var controls;
/**
 * Mesh of tibia
 */
var mesh;
/**
 * Get Document for view
 */
var divScene3d = document.getElementById('view3D');

/**
 *  Initialisation de la 3D
 */
function init() {
    /**
     * Initialisation de la scene
     */
    scene = new THREE.Scene();
    /**
     * Fix camera 3D
     * @type {THREE.PerspectiveCamera}
     */
    camera3D = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
    camera3D.position.set(0,100,200);
    camera3D.lookAt(scene.position);
    /**
     * Fix camera ViewX
     * @type {THREE.PerspectiveCamera}
     */
    addLighting();

    /**
     * Initialisation Render
     * @type {THREE.WebGLRenderer}
     */
    renderer3D = new THREE.WebGLRenderer({antialiasing: true});
    /**
     * Append all element
     */
    divScene3d.appendChild(renderer3D.domElement);
    renderer3D.setSize(window.innerWidth,window.innerHeight);
    /**
     * Axis Helper
     */
    var axis = new THREE.AxisHelper(150);
    scene.add(axis);
    /**
     * Add orbit controls
     */
    controls = new THREE.OrbitControls(camera3D, renderer3D.domElement);
    /**
     *  Initialisation de Gui
     */
    var gui = new dat.GUI();
    var parameters =
    {
        tx: 0, // numeric slider
        ty: 0, // numeric slider
        tz: 0, // numeric slider
        rx: 0, // numeric slider
        tp:0,
        display : false
    };
    var folderMandibule = gui.addFolder('mandibule');
    var translationX = folderMandibule.add( parameters, 'tx' ).min(-50).max(50).step(0.25).name('translationX');
    var translationY = folderMandibule.add( parameters, 'ty' ).min(-50).max(50).step(0.25).name('translationY');
    var translationZ = folderMandibule.add( parameters, 'tz' ).min(-50).max(50).step(0.25).name('translationZ');
    var rotationX = folderMandibule.add( parameters, 'rx' ).min(-2).max(2).step(0.01).name('rotationCondyle');
    var translationplane = folderMandibule.add( parameters, 'tp' ).min(-50).max(50).step(0.01).name('translation plan');
    var display = folderMandibule.add(parameters,'display');
    folderMandibule.open();
    gui.open();

    /**
     * Link of mandibular and maxilla
     * @type {string}
     */
    var linkMandibule = "mandibule3.obj";
    var linkMaxillaire = "maxillaire3.obj";
    /**
     * Function Load Object
     * @return THREE.Object3Ds
     */
    var objectMandibule =  loadObject(linkMandibule);
    var objectMaxillaire = loadObject(linkMaxillaire);
    var objectMaxillaireSimplified;
    var box,box2;
    /**
     * Operation for asynch function (wait for object)
     */
    setTimeout(function () {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].material.wireframe = true;
        objectMaxillaire.children[0].material.wireframe = true;
        objectMaxillaire.children[0].visible = false;
        objectMaxillaireSimplified = drawIntersectionPoints(tableOfPlane,objectMaxillaire.children[0]);
        box = new THREE.BoxHelper( objectMaxillaireSimplified.children[0], 0xffff00 );
        box2 = new THREE.BoxHelper( objectMandibule.children[0], 0xffff00 );
        scene.add(box);
        // scene.add(box2);
    },1000);
    /**
     * Add object
     */
    scene.add(objectMandibule);
    scene.add(objectMaxillaire);
    /**
     * Manipulate object
     */
    var tableOfPlane = [];
    for( var i = -5; i <5 ; i ++) {

        var planeGeom = new THREE.PlaneGeometry(100, 80);
        var plane = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({
            color: "pink",
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        }));
        plane.position.y = i*2;
        plane.rotation.x = Math.PI/2;
        tableOfPlane.push(plane);
        plane.visible = false;
    }
    for (var i = 0 ; i < tableOfPlane.length ; i++) scene.add(tableOfPlane[i]);

    display.onChange(function () {
        drawIntersectionPoints(tableOfPlane,objectMaxillaire.children[0]);

    });
    translationX.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].position.x = value;
        box2.position.x = value;
        // collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
    });
    translationY.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].position.y = value;
        box2.position.y = value;
        // collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
    });
    translationZ.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].position.z = value;
        box2.position.z = value;
        //collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
    });
    rotationX.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].rotation.x = value;
        box2.rotation.x = value;
        //collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
    });
    translationplane.onChange(function (value) {
        plane.position.y = value;
        drawIntersectionPoints(plane,objectMaxillaire.children[0]);
        drawIntersectionPoints(plane,objectMandibule.children[0]);
    });

}
/**
 * 
 */
function render() {
    requestAnimationFrame(render);
    renderer3D.render(scene, camera3D);
    controls.update();
}
/**
 * 
 * @param {*obj} object 
 * @param {*obj} objectFixe 
 */
function collision(object,objectFixe) {
    var firstBB = new THREE.Box3().setFromObject(object.children[0]);
    var secondBB = new THREE.Box3().setFromObject(objectFixe.children[0]);
    var collision = firstBB.intersectsBox(secondBB);
    if(collision) {
        object.children[0].material.wireframe = true;
        objectFixe.children[0].material.wireframe = true;
    }
    else {
        object.children[0].material.wireframe = false;
        objectFixe.children[0].material.wireframe = false;
    }
    console.log(collision);

}
/**
 * @return void
 * @param objectMaxillaire
 * @param objectMandibuled
 */
function computeCollision(objectMandibule,objectMaxillaire) {
    console.log(objectMaxillaire);
    objectMandibule.children[0].material.wireframe = false;
    var tableObjectMandibule = [];
    tableObjectMandibule.push(objectMaxillaire);
    for (var vertexIndex = 0; vertexIndex < objectMandibule.children[0].geometry.vertices.length; vertexIndex++) {
        var localVertex = objectMandibule.children[0].geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(objectMandibule.children[0].matrix);
        var directionVector = globalVertex.sub(objectMandibule.children[0].position);
        var ray = new THREE.Raycaster(objectMandibule.children[0].position.clone(), directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(tableObjectMandibule);
        if (collisionResults.length > 0   && collisionResults[0].distance < directionVector.length()) {
          //  objectMaxillaire.children[0].material.wireframe = true;
            objectMandibule.children[0].material.wireframe = true;
        }
    }
}

/*

function computeCollision(NewPoint) {
    var collidableMeshList = [];
    collidableMeshList.push(objectMaxillaire.children[0]);
    for (var vertexIndex = 0; vertexIndex < objectMandibule.children[0].geometry.vertices.length; vertexIndex++) {
        var localVertex = objectMandibule.children[0].geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(objectMandibule.children[0].matrix);
        var directionVector = globalVertex.sub(objectMandibule.children[0].position);
        var ray = new THREE.Raycaster(NewPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if (collisionResults.length > 0   && collisionResults[0].distance < directionVector.length()) {
        }
    }
}
*/


init();
render();