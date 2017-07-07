/**
 * Created by Utilisateur on 07/07/2017.
 */

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables

var MovingCube;// objet en mouvement
var NewMovingCube;// variable test pour le changement de texture de l'objet en mouvement
var wall; // objet fixe
var collidableMeshList = [];

var geometry ; // géométrie objet fixe
var material;// texture objet fixe

var cubeGeometry; // géométrie objet en mouvement
var wireMaterial;// texture objet en mouvement

var arrowList = [];
var directionList = [];

var NewPoint;// variable qui garde en mémoire la position de l'objet en mouvement après avoir détecter une collision
var NewWall;
var NewMovingCube;
var res =0;

var cptUp =0;
var cptDown =0;
var cptAffichage =0;// sert à compter le nombre de déplacement des objets 3D => Calcul du déplacement en mm
var cptRes = 0;

init();
render();

// FUNCTIONS
function init()
{
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);

    scene.add(camera);
    camera.position.set(0,100,200);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer( {antialias:true} );

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff, 1 );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container = document.getElementById( "ThreeJS" );
    container.appendChild( renderer.domElement );

    // EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,500);
    scene.add(light);


    var loader2 = new THREE.OBJLoader();
    var cheminMaxillaire="maxillaire3.obj";
    var loader = new THREE.OBJLoader();
    var cheminMand= "mandibule3.obj";

    loader2.load(cheminMaxillaire,function(object){
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                cubeGeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                wireMaterial = new THREE.MeshPhongMaterial( { color: 0xE3DAC9});
                MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
                scene.add( MovingCube );
            }
        })
    });

    loader.load(cheminMand,function(object){
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                material = new THREE.MeshPhongMaterial({ color: 0xE3DAC9});//, wireframe:true});
                wall = new THREE.Mesh(geometry,material);
                wall.position.set(0, -5, 0);
                scene.add(wall);
                collidableMeshList.push(wall); // permet de garder en mémoire l'objet qui ne doit pas rentrer en collision avec l'objet en mouvement.
            }
        })
    });
}

function clearText()
{   document.getElementById('message').innerHTML = '..........';   }

function appendText(txt)
{   document.getElementById('message').innerHTML = txt;   }

function detectionText(txt)
{   document.getElementById('message2').innerHTML = txt; }




function collisionColor()
{

    MovingCube.position.x= NewPoint.x;
    MovingCube.position.y= NewPoint.y;
    MovingCube.position.z =NewPoint.z ;
    MovingCube.material.color.setHex(0xFF0000);
    wall.material.color.setHex(0xFF0000);
    var col = Math.abs(MovingCube.position.y);
    var compteur = (cptRes*0.1).toFixed(1);
    res = compteur - col;
}

function unCollisionColor()
{
  MovingCube.material.color.setHex(0xE3DAC9);
  wall.material.color.setHex(0xE3DAC9);
}

function update()
{
    var delta = clock.getDelta();
    var moveDistance = 0.1;
    var rotateAngle = Math.PI / 2 * delta;
    var originPoint;

    if ( keyboard.pressed("up") )
    {

        console.log(MovingCube.material.color.setHex(0xE3DAC9));
        detectionText("");
        clearText();
        MovingCube.material.color.setHex(0xE3DAC9);
        wall.material.color.setHex(0xE3DAC9);
        MovingCube.position.y += moveDistance;
        NewPoint = MovingCube.position.clone();
        cptUp = cptUp - 1;
        cptAffichage = cptDown + cptUp;
        cptRes = cptUp;
        computeCollision(NewPoint);
        console.log(MovingCube.material.color);
    }


    if ( keyboard.pressed("down") )
    {
        detectionText("");
        clearText();
        console.log(MovingCube.material.color.setHex(0xE3DAC9));
        MovingCube.material.color.setHex(0xE3DAC9);
        wall.material.color.setHex(0xE3DAC9);
        MovingCube.position.y -= moveDistance;
        NewPoint = MovingCube.position.clone();
        cptDown = cptDown + 1;
        cptAffichage = cptDown +cptUp;
        cptRes = cptDown;
        computeCollision(NewPoint);
        console.log(MovingCube.material.color);

    }

    if ( keyboard.pressed("R") )
    {
        location.reload(); // recharge la page
    }
}
function computeCollision(NewPoint) {


    for (var vertexIndex = 0; vertexIndex < cubeGeometry.vertices.length; vertexIndex++) {
        appendText((cptAffichage * 0.1).toFixed(1) + " mm");
        var localVertex = cubeGeometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(MovingCube.matrix);
        var directionVector = globalVertex.sub(MovingCube.position);
        var ray = new THREE.Raycaster(NewPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if (collisionResults.length >  0 && collisionResults[0].distance < directionVector.length()) {
            detectionText(" Collision Detected ");
            MovingCube.material.color.setHex(0xFF0000);
            wall.material.color.setHex(0x00FF00);
            if(MovingCube.position.y == -0.5){
                MovingCube.material.color.setHex(0xE3DAC9);
                wall.material.color.setHex(0xE3DAC9);
                detectionText("");
                clearText();
            }
        }
    }
}
function render()
{   // NewPoint = MovingCube.position.clone();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    controls.update();
    update();
}
