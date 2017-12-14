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
var sceneGout;
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

var shape;

var raycaster;
var mouse;
var particle3D = [];
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

    group = new THREE.Group();
	
				scene.add( group );
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

    var loader2 = new THREE.OBJLoader();
    var cheminMaxillaire="bohn_Mandibule1000.obj";
    var loader = new THREE.OBJLoader();
    var cheminMand= "bohn_Maxillaire1000.obj";

    loader2.load(cheminMaxillaire,function(object){
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                maxGeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                wireMaterial = new THREE.MeshPhongMaterial( { color: 0xE3DAC9});
                maxillaire = new THREE.Mesh( maxGeometry, wireMaterial );
                maxillaire.name = 'maxillaire';
               // scene.add( maxillaire );
            }
        })
    });

    loader.load(cheminMand,function(object){
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                material = new THREE.MeshPhongMaterial({ color: 0xE3DAC9});//, wireframe:true});
                mandibule = new THREE.Mesh(geometry,material);
                mandibule.name = 'mandibule';
                mandibule.position.set(0, -5, 0);
               // scene.add(mandibule);
               // collidableMeshList.push(mandibule); // permet de garder en mémoire l'objet qui ne doit pas rentrer en collision avec l'objet en mouvement.
            }
        })
    });

    raycaster=new THREE.Raycaster();
    mouse = new THREE.Vector2();

    particleMaterial = new THREE.MeshPhongMaterial({color: 0x00FF00});
    document.addEventListener('dblclick', onDocumentMouseDown, false);



    /**
     *  Initialisation de Gui
     */

    var gui = new dat.gui.GUI();
    var parameters =
    {
        tx: 0.0001, // numeric slider
        ty: 0.0001, // numeric slider
        tz: 0.0001, // numeric slider
        rx: 0.0001, // numeric slider
        ry: 0.0001, // numeric slider
        rz: 0.0001, // numeric slider
        tp:0,
        gout : false ,
        display : false,
        empreinte: false,
        grx: 0.0001,
        gry: 0.0001,
        grz: 0.0001,
        gtx: 0.0001, // numeric slider
        gty: 0.0001, // numeric slider
        gtz: 0.0001, // numeric slider
 
        /*camera3D: {
            speed: 0.1
        }*/
    };
    gui.remember(parameters);
    gui.open();
    var folderMandibule = gui.addFolder('mandibule');
    var translationX = folderMandibule.add( parameters, 'tx' ).min(-8).max(1).step(.1).name('Translation X');//.listen();//.listen() permet de bloquer le changement de valeur par clavier
    var translationY = folderMandibule.add( parameters, 'ty' ).min(-8).max(1).step(.1).name('Translation Y');//.listen();
    var translationZ = folderMandibule.add( parameters, 'tz' ).min(-8).max(1).step(.1).name('Translation Z');//.listen();
    var rotationX    = folderMandibule.add( parameters, 'rx' ).min(-1).max(1).step(0.001).name('Rotation X');//.listen();
    var rotationY    = folderMandibule.add( parameters, 'ry' ).min(-1).max(1).step(0.001).name('Rotation Y');//.listen();
    var rotationZ    = folderMandibule.add( parameters, 'rz' ).min(-1).max(1).step(0.001).name('Rotation Z');//.listen();
    //var translationplane = folderMandibule.add( parameters, 'tp' ).min(-10).max(10).step(0.01).name('translation plan');
    var display = folderMandibule.add(parameters,'display');
    folderMandibule.open();

    var folderGouttiere = gui.addFolder('Gouttière');

     var goutObj = folderGouttiere.add(parameters,'gout').name('Création gouttière');
 
   /* var positionGoutTX = folderGouttiere.add( parameters, 'gtx' ).min(-50).max(50).step(.1).name('Translation X');//.listen();//.listen() permet de bloquer le changement de valeur par clavier
    var positionGoutTY = folderGouttiere.add( parameters, 'gty' ).min(-50).max(50).step(.1).name('Translation Y');//.listen();
    var positionGoutTZ = folderGouttiere.add( parameters, 'gtz' ).min(-50).max(50).step(.1).name('Translation Z');//.listen();
    var positionGoutRX = folderGouttiere.add(parameters,'grx').min(-1).max(1).step(.001).name('Rotation X');
    var positionGoutRY = folderGouttiere.add(parameters,'gry').min(-1).max(1).step(.001).name('Rotation Y');
    var positionGoutRZ = folderGouttiere.add(parameters,'grz').min(-1).max(1).step(.001).name('Rotation Z');
     var creaEmpreinte = folderGouttiere.add(parameters,'empreinte').name('Empreinte');*/
     folderGouttiere.open();

    translationX.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].position.x = value;
        //box2.position.x = value;
        // collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
        updateParameters();
    });

    translationY.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].position.y = value;
        //box2.position.y = value;
        // collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);  

    });

    translationZ.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].position.z = value;
        //box2.position.z = value;
        //collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
        updateParameters();
    });

    rotationX.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].rotation.x = value;
        //box2.rotation.x = value;
        //collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
        updateParameters();
    });

    rotationY.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].rotation.y = value;
        //box2.rotation.x = value;
        //collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
        updateParameters();
    });

    rotationZ.onChange(function (value) {
        objectMandibule.children[0].material.color.setHex(0xFF0000);
        objectMaxillaire.children[0].material.color.setHex(0x00FF00);
        objectMandibule.children[0].rotation.z = value;
        //box2.rotation.x = value;
        //collision(objectMandibule,objectMaxillaire);
        computeCollision(objectMandibule,objectMaxillaireSimplified);
        updateParameters();
    });


    display.onChange(function(){
        objectMandibule.visible = true;
        objectMaxillaire.visible = true;
    });


    goutObj.onChange( function (){
        addGouttiere();
    });


    function updateParameters()
    {
        objectMandibule.children[0].position.x = parameters.tx;
        objectMandibule.children[0].position.y = parameters.ty;
        objectMandibule.children[0].position.z = parameters.tz;
        objectMandibule.children[0].rotation.x = parameters.rx;          
    //objectMandibule.children[0].visible = parameters.visible;
    }

    /**
     * Link of mandibular and maxilla
     * @type {string}
     */
    var linkMandibule = "bohn_Mandibule1000.obj";
    var linkMaxillaire = "bohn_Maxillaire1000.obj";
    /**
     * Function Load Object
     * @return THREE.Object3Ds
     */
    var objectMandibule =  loadObject(linkMandibule);
    var objectMaxillaire = loadObject(linkMaxillaire);
    var objectMaxillaireSimplified;
    var gouttiere;
    var box,box2;
    var posX,posY,posZ;
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

        //intersection(objectMaxillaire.children[0], objectMandibule.children[0]);
        //objectMaxillaireSimplified = new THREE.EdgesHelper( objectMaxillaire.children[0], 0x00ffff );
        //objectMaxillaireSimplified.material.linewidth = 2; // optional
        //scene.add( objectMaxillaireSimplified ); 
        //intersection(objectMandibule,objectMaxillaire);
       /* box = new THREE.BoxHelper( objectMaxillaireSimplified.children[0], 0xffff00 );
        box2 = new THREE.BoxHelper( objectMandibule.children[0], 0xffff00 );
        scene.add(box);
        scene.add(box2);*/
    },1000);
    /**
     * Add object
     */
    scene.add(objectMandibule);
    scene.add(objectMaxillaire);
       
    var tableOfPlane = [];
    for( var i = -10; i <5 ; i ++) {

        var planeGeom = new THREE.PlaneGeometry(100, 80);
        var plane = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({
            color: "pink",
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        }));
        plane.position.y = i*2; //objectMaxillaire.position.y;// 
        plane.rotation.x = Math.PI/2;
        scene.add(plane);
        scene.add(objectMaxillaire);
        
        tableOfPlane.push(plane);
        
        plane.visible = false;
    }
    for (var i = 0 ; i < tableOfPlane.length ; i++) 
        scene.add(tableOfPlane[i]);
    
    var contour = [];
    for( var i = 0; i <3 ; i ++) {

        var planeGeom = new THREE.PlaneGeometry(100, 80);
        var plane = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({
            color: "pink",
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        }));
        plane.position.y = i*2; //objectMaxillaire.position.y;// 
        plane.rotation.x = Math.PI/2;
        scene.add(plane);
        scene.add(objectMaxillaire);
        
        contour.push(plane);
        
        plane.visible = false;
    }
    for (var i = 0 ; i < contour.length ; i++) 
        scene.add(contour[i]);


}

  /*  display.onChange(function () {
        objectMaxillaireSimplified = drawIntersectionPoints(tableOfPlane[i],objectMaxillaire.children[0]);
    });*/
    

        function onDocumentMouseDown(event) {
  
        event.preventDefault();
        mouse.x = ( (event.clientX  ) /  window.innerWidth ) * 2 - 1;
        mouse.y = -( (event.clientY ) /  window.innerHeight ) * 2 + 1;
       
        //console.log("mouse", mouse.x, mouse.y);
        raycaster.setFromCamera(mouse, camera3D);
        var intersects = raycaster.intersectObject(mandibule);
        if (intersects.length > 0) {
            var pointSphere = new THREE.SphereGeometry(1, 15, 15);
            particle = new THREE.Mesh(pointSphere, particleMaterial);
            particle.position.copy(intersects[0].point);
            particle3D.push(particle);
            scene.add(particle);
        }
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


/**
 * @return void
 * @param objectMaxillaire
 * @param objectMandibule
 */

var nbCollision = 0;

function computeCollision(objectMandibule,objectMaxillaire) { 

    //console.log(objectMaxillaire);
    objectMandibule.children[0].material.wireframe = false;
    var tableObjectMandibule = [];
    tableObjectMandibule.push(objectMaxillaire);
    for (var vertexIndex = 0; vertexIndex < objectMandibule.children[0].geometry.vertices.length; vertexIndex++) {
        var localVertex = objectMandibule.children[0].geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(objectMandibule.children[0].matrix);
        var directionVector = globalVertex.sub(objectMandibule.children[0].position);
        var ray = new THREE.Raycaster(objectMandibule.children[0].position.clone(), directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(tableObjectMandibule);
       // console.log("Vertex index: " + vertexIndex);

if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                    objectMandibule.children[0].updateMatrix();
                    objectMandibule.children[0].material.wireframe = true;
				} 
        }
}



init();
render();