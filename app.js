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
var wall; // objet fixe
var collidableMeshList = [];

var geometry ; // géométrie objet fixe
var material;// texture objet fixe

var cubeGeometry; // géométrie objet en mouvement
var wireMaterial;// texture objet en mouvement

var arrowList = [];
var directionList = [];

var NewPoint;// variable qui garde en mémoire la position de l'objet en mouvement après avoir détecter une collision
var res =0;

var cptUp =0;
var cptDown =0;
var cptAffichage =0;// sert à compter le nombre de déplacement des objets 3D => Calcul du déplacement en mm
var cptRes = 0;

var plane,plane2;
var pointsOfIntersection =  new THREE.Geometry();
var pointOfIntersection = new THREE.Vector3();


var collisionTab= new Array;
/*var collisionTabPosy = [] ;
var collisionTabRotz = [] ;
var collisionTabRotzP = [] ;
var collisionTabRotzN = [] ;*/
var col0= new Array;
var col1 = new Array;



var firstCol=0;

var firstColx=0;
var firstColy=0;
var firstColz=0;
var firstRotz=0;
var firstRotzN=0;
var firstRotzP=0;

var Rotation = 0;
var cptLeft = 0;
var cptRight = 0;
var signe;
var nbCollision = 0;

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
                MovingCube.name = 'maxillaire';
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
                wall.name = 'mandibule';
                wall.position.set(0, -5, 0);
                scene.add(wall);
                collidableMeshList.push(wall); // permet de garder en mémoire l'objet qui ne doit pas rentrer en collision avec l'objet en mouvement.
            }
        })
    });
}


    left = document.getElementById('left');
    right = document.getElementById('right');
    up = document.getElementById('up');
    down = document.getElementById('down');

 /*   planeUp = document.getElementById('buttonUp');
    planeDown = document.getElementById('buttonDown');*/

function clearText()
{   document.getElementById('message').innerHTML = '..........';   }

function appendText(txt)
{   document.getElementById('message').innerHTML = txt;   }

function detectionText(txt)
{   document.getElementById('message2').innerHTML = txt; }

function contour3D()
{
     if( wall.name == 'mandibule')
     {
        var helper = new THREE.EdgesHelper( wall, 0x00ffff );
        helper.material.linewidth = 2; // optional
        scene.add( helper ); 
     }
    if( MovingCube.name == 'maxillaire')
    {
        var helper2 = new THREE.EdgesHelper( MovingCube, 0x00ffff );
        helper2.material.linewidth = 2; // optional
        scene.add( helper2 );
    }
}



function contour2DMan()
{
     if( wall.name == 'mandibule')
     {
        var geometryPlane = new THREE.PlaneGeometry(100, 100);
        var materialPlane = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        plane = new THREE.Mesh( geometryPlane, materialPlane );
        plane.rotation.x = Math.PI / 2;
        plane.position.y = wall.position.y;
        scene.add( plane );
        planeUpMan.onclick = function()
        {
            plane.position.y += MovePlane;
        }

        planeDownMan.onclick = function()
        {
            plane.position.y -= MovePlane;
        }

        ValiderPlanMan.onclick = function()
        {
            intersectionPlanMan();
            scene.remove(wall);
            scene.remove(plane);
        }
     }
}

function contour2DMax()
{

    if( MovingCube.name == 'maxillaire')
    {
        var geometryPlane2 = new THREE.PlaneGeometry(100, 100);
        var materialPlane2 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        plane2 = new THREE.Mesh( geometryPlane2, materialPlane2 );
        plane2.rotation.x = Math.PI / 2;
        plane2.position.y = MovingCube.position.y;
        scene.add( plane2 );
        planeUpMax.onclick = function()
        {
            plane2.position.y += MovePlane;
        }

        planeDownMax.onclick = function()
        {
            plane2.position.y -= MovePlane;
        }

        ValiderPlanMax.onclick = function()
        {
            intersectionPlanMax();
            scene.remove(MovingCube);
            scene.remove(plane2);
        }
    }
}


function intersectionPlanMan()
{
    var planePointA = new THREE.Vector3(),
    planePointB = new THREE.Vector3(),
    planePointC = new THREE.Vector3();

    var mathPlane = new THREE.Plane();
    plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
    plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
    plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
    mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

    var a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3();

    wall.geometry.faces.forEach(function(face) {
    wall.localToWorld(a.copy(wall.geometry.vertices[face.a]));
    wall.localToWorld(b.copy(wall.geometry.vertices[face.b]));
    wall.localToWorld(c.copy(wall.geometry.vertices[face.c]));
    lineAB = new THREE.Line3(a, b);
    lineBC = new THREE.Line3(b, c);
    lineCA = new THREE.Line3(c, a);
    setPointOfIntersection(lineAB, mathPlane);
    setPointOfIntersection(lineBC, mathPlane);
    setPointOfIntersection(lineCA, mathPlane);

       function setPointOfIntersection(line, plane) {
        pointOfIntersection = plane.intersectLine(line);
        if (pointOfIntersection) {
            pointsOfIntersection.vertices.push(pointOfIntersection.clone());
        };

    var pointsMaterial = new THREE.PointsMaterial({
        size: .5,
        color: "blue"
    });
    var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
    scene.add(points);

     var lines = new THREE.LineSegments(pointsOfIntersection, new THREE.LineBasicMaterial({
    color: 0xff0000
  }));
  scene.add(lines);
        }



  });

}

function intersectionPlanMax()
{
    var planePointA2 = new THREE.Vector3(),
    planePointB2 = new THREE.Vector3(),
    planePointC2 = new THREE.Vector3();

    var mathPlaneMax = new THREE.Plane();
    plane2.localToWorld(planePointA2.copy(plane2.geometry.vertices[plane2.geometry.faces[0].a]));
    plane2.localToWorld(planePointB2.copy(plane2.geometry.vertices[plane2.geometry.faces[0].b]));
    plane2.localToWorld(planePointC2.copy(plane2.geometry.vertices[plane2.geometry.faces[0].c]));
    mathPlaneMax.setFromCoplanarPoints(planePointA2, planePointB2, planePointC2);

    var a2 = new THREE.Vector3(),
    b2 = new THREE.Vector3(),
    c2 = new THREE.Vector3();

    MovingCube.geometry.faces.forEach(function(face) {
    MovingCube.localToWorld(a2.copy(MovingCube.geometry.vertices[face.a]));
    MovingCube.localToWorld(b2.copy(MovingCube.geometry.vertices[face.b]));
    MovingCube.localToWorld(c2.copy(MovingCube.geometry.vertices[face.c]));
    lineAB2 = new THREE.Line3(a2, b2);
    lineBC2 = new THREE.Line3(b2, c2);
    lineCA2 = new THREE.Line3(c2, a2);
    setPointOfIntersection(lineAB2, mathPlaneMax);
    setPointOfIntersection(lineBC2, mathPlaneMax);
    setPointOfIntersection(lineCA2, mathPlaneMax);
    function setPointOfIntersection(line, plane2) {
        pointOfIntersection = plane2.intersectLine(line);
        if (pointOfIntersection) {
            pointsOfIntersection.vertices.push(pointOfIntersection.clone());
        };

    var pointsMaterial = new THREE.PointsMaterial({
        size: .5,
        color: "blue"
    });
    var points2 = new THREE.Points(pointsOfIntersection, pointsMaterial);
    scene.add(points2);

     var lines2 = new THREE.LineSegments(pointsOfIntersection, new THREE.LineBasicMaterial({
    color: 0x00FF00
  }));
  scene.add(lines2);
        }

  });

}



var MovePlane = 0.1;


function update()
{
    
    var delta = clock.getDelta();
    var moveDistance = 0.1;
    var rotateAngle = 0.01;//Math.PI / 12 * 0.1;
    var originPoint;
   
    
    //if ( keyboard.pressed("left") )
    left.onclick = function()
	{
        detectionText("");
        clearText();
        MovingCube.material.color.setHex(0xE3DAC9);
        wall.material.color.setHex(0xE3DAC9);
		MovingCube.rotation.z += rotateAngle;
        NewPoint = MovingCube.position.clone();
        computeCollision(NewPoint);
        cptLeft = cptLeft + 1 ;
       // console.log(cptLeft);
	}


	//if ( keyboard.pressed("right") )
    right.onclick = function()
	{
        detectionText("");
        clearText();
        MovingCube.material.color.setHex(0xE3DAC9);
        wall.material.color.setHex(0xE3DAC9);
		MovingCube.rotation.z -= rotateAngle;
        NewPoint = MovingCube.position.clone();
        computeCollision(NewPoint);
        cptRight = cptRight - 1 ;
       // console.log(cptRight);
	}

Rotation = cptLeft + cptRight;

    //if ( keyboard.pressed("up") )
    up.onclick = function()
    {
        detectionText("");
        clearText();
        MovingCube.material.color.setHex(0xE3DAC9);
        wall.material.color.setHex(0xE3DAC9);
        MovingCube.position.y += moveDistance;
        NewPoint = MovingCube.position.clone();
        cptUp = cptUp - 1;
        computeCollision(NewPoint);
    }

    //if ( keyboard.pressed("down") )
    down.onclick=function()
    {
        detectionText("");
        clearText();
        MovingCube.material.color.setHex(0xE3DAC9);
        wall.material.color.setHex(0xE3DAC9);
        MovingCube.position.y -= moveDistance;
        NewPoint = MovingCube.position.clone();
        cptDown = cptDown + 1;
        computeCollision(NewPoint);
        cptAffichage = cptDown + cptUp;
    }

     signe = Math.sign(Rotation);

    if ( keyboard.pressed("R") )
    {
        location.reload(); // recharge la page
    }
 }    

function computeCollision(NewPoint) {

    for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++) {
       // appendText((cptAffichage * 0.1).toFixed(1) + " mm");
      
        appendText("x = " + (MovingCube.position.x).toFixed(1) + " y = " + (MovingCube.position.y).toFixed(1) + " z = " +  (MovingCube.position.z).toFixed(1) + " Rotation = " +  (MovingCube.rotation.z).toFixed(2));
      
        var localVertex = cubeGeometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(MovingCube.matrix);
        var directionVector = globalVertex.sub(MovingCube.position);
        var ray = new THREE.Raycaster(NewPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        

      
        if (collisionResults.length > 0   && collisionResults[0].distance < directionVector.length()) {
            
            detectionText(" Collision Detected ");
            nbCollision = nbCollision +1;
            console.log(nbCollision);
          
            MovingCube.material.color.setHex(0xFF0000);
            wall.material.color.setHex(0xFF0000);
           

        if(nbCollision == 1 && signe == -1)
           {
                firstColy = MovingCube.position.y;
                firstRotzN = MovingCube.rotation.z;             
           }
//
        else if(nbCollision == 1 && signe == 1)
           {
                firstColy = MovingCube.position.y;
                firstRotzP = MovingCube.rotation.z;           
           }

        else if (nbCollision == 1 && signe == 0)
           {
                firstColy = MovingCube.position.y;
                firstRotz = MovingCube.rotation.z; // forcément = 0 puisque la rotation est nulle
           }

         /*   for(var i= 0; i< nbCollision; i++)
            {
                col0[i] = firstColy;
                col1[i] = firstRotz;
            }
            collisionTab[0] = col0;
            collisionTab[1] = col1;*/

          /*  nbCollision = nbCollision +1;   // équivalent à nbCollision = nbCollision +1;
            console.log(nbCollision);
            if(nbCollision == 1 && signe == 0) // cas sans rotation
             {
                firstColy = MovingCube.position.y;
                firstRotz = MovingCube.rotation.z;
                console.log("Pas de rotation");
                console.log(firstColy);
                console.log(firstRotz);
             }

            if(nbCollision == 1  && signe == -1) // cas avec une rotation negative en z
            {
                firstColy = MovingCube.position.y;
                firstRotzN = MovingCube.rotation.z;
                console.log(firstColy);
                console.log(firstRotzN);
                console.log("Rotation négative");
            }

            if(nbCollision == 1 && signe == 1) // cas avec une rotation positive en z
            {
                firstColy = MovingCube.position.y;
                firstRotzP = MovingCube.rotation.z;
                console.log(firstColy);
                console.log(firstRotzP);
                console.log("Rotation positive");
            }*/

            /*console.log("collisionTabPosy[n] = " + collisionTabPosy[n]);
              console.log("collisionTabRotzN[n] = " + collisionTabRotzN[n]);
              console.log("collisionTabRotzP[n] = " + collisionTabRotzP[n]);
              console.log("collisionTabRotz[n] = " + collisionTabRotz[n]);*/
        /*  for (var nb = 0; nb <= collisionTab.length; nb++)
          {
              console.log(collisionTab[0][nb]);
              console.log(collisionTab[1][nb]);
              if(    ( MovingCube.position.y >  collisionTab[0][nb]  &&  MovingCube.rotation.z ==  collisionTab[1][nb] ) //    si nvellePosY > colPosY et nvelleRotZ > colRotZN : si on bouge en y et en rotation neg
               /*     || ( MovingCube.position.y >  collisionTabPosy[n]  &&  MovingCube.rotation.z <  collisionTabRotzP[n] ) // ou si nvellePosY > colPosY et nvelleRotZ < colRotZP :si on bouge en y et en rotation pos 
                    || ( MovingCube.position.y >  collisionTabPosy[n]  &&  MovingCube.rotation.z == collisionTabRotzN[n] ) // ou si nvellePosY > colPosY et nvelleRotZ = colRotZ : si on bouge en y mais pas en rotation neg
                    || ( MovingCube.position.y == collisionTabPosy[n]  &&  MovingCube.rotation.z >  collisionTabRotzN[n] ) // ou si nvellePosY = colPosY et nvelleRotZ > colRotZN: si on bouge pas en y mais en rotation neg
                    || ( MovingCube.position.y >  collisionTabPosy[n]  &&  MovingCube.rotation.z == collisionTabRotzP[n] ) // ou si nvellePosY > colPosY et nvelleRotZ = colRotZP: si on bouge en y mais pas en rotation pos
                    || ( MovingCube.position.y == collisionTabPosy[n]  &&  MovingCube.rotation.z <  collisionTabRotzP[n] ) // ou si nvellePosY = colPosY et nvelleRotZ < colRotZP: si on bouge pas en y mais en rotation pos
                    || ( MovingCube.position.y >  collisionTabPosy[n]  &&  MovingCube.rotation.z <  collisionTabRotz[n]  ) // ou si nvellePosY > colPosY et nouvelle rotation neg : Si on bouge en y et si on crée une rot neg
                    || ( MovingCube.position.y >  collisionTabPosy[n]  &&  MovingCube.rotation.z >  collisionTabRotz[n]  ) // ou si nvellePosY > colPosY et nouvelle rotation pos : Si on bouge en y et si on crée une rot pos
                    || ( MovingCube.position.y == collisionTabPosy[n]  &&  MovingCube.rotation.z <  collisionTabRotz[n]  ) // ou si nvellePosY = colPosY et nouvelle rotation neg: si on bouge pas en y mais en rotation nèg
                    || ( MovingCube.position.y == collisionTabPosy[n]  &&  MovingCube.rotation.z >  collisionTabRotz[n]  ) // ou si nvellePosY = colPosY et nouvelle rotation pos: si on bouge pas en y mais en rotation pos
                    || ( MovingCube.position.y >  collisionTabPosy[n]  &&  MovingCube.rotation.z == collisionTabRotz[n]  ) // ou si nvellePosY > colPosY et pas de rotation : Si on bouge en y et on a une rotation nulle
                ) 
                {
                    MovingCube.material.color.setHex(0xE3DAC9);
                    wall.material.color.setHex(0xE3DAC9);
                    detectionText("");
                    // appendText((cptAffichage * 0.1).toFixed(1) + " mm");
                    // appendText("x = " + MovingCube.position.x + " y = " + MovingCube.position.y + " z = " +  MovingCube.position.z + " Rotation = " +  Rotation);
                    appendText("x = " + (MovingCube.position.x).toFixed(1) + " y = " + (MovingCube.position.y).toFixed(1) + " z = " +  (MovingCube.position.z).toFixed(1) + " Rotation = " +  (MovingCube.rotation.z).toFixed(2));
                    // nbCollision = 0;
                    console.log("ok");
                }
        }*/   
                }
                else{
                        if(        ((MovingCube.position.y >  firstColy ) &&  (MovingCube.rotation.z >  firstRotzN )) //    si nvellePosY > colPosY et nvelleRotZ > colRotZN : si on bouge en y et en rotation neg
                                || (( MovingCube.position.y >  firstColy)  &&  (MovingCube.rotation.z <  firstRotzP )) // ou si nvellePosY > colPosY et nvelleRotZ < colRotZP :si on bouge en y et en rotation pos 
                                || (( MovingCube.position.y >  firstColy)  &&  (MovingCube.rotation.z == firstRotzN )) // ou si nvellePosY > colPosY et nvelleRotZ = colRotZ : si on bouge en y mais pas en rotation neg
                                || (( MovingCube.position.y == firstColy)  &&  (MovingCube.rotation.z >  firstRotzN )) // ou si nvellePosY = colPosY et nvelleRotZ > colRotZN: si on bouge pas en y mais en rotation neg
                                || (( MovingCube.position.y >  firstColy)  &&  (MovingCube.rotation.z == firstRotzP)) // ou si nvellePosY > colPosY et nvelleRotZ = colRotZP: si on bouge en y mais pas en rotation pos
                                || (( MovingCube.position.y == firstColy)  &&  (MovingCube.rotation.z <  firstRotzP)) // ou si nvellePosY = colPosY et nvelleRotZ < colRotZP: si on bouge pas en y mais en rotation pos
                                || (( MovingCube.position.y >  firstColy)  &&  (MovingCube.rotation.z <  firstRotz )) // ou si nvellePosY > colPosY et nouvelle rotation neg : Si on bouge en y et si on crée une rot neg
                                || (( MovingCube.position.y >  firstColy)  &&  (MovingCube.rotation.z >  firstRotz )) // ou si nvellePosY > colPosY et nouvelle rotation pos : Si on bouge en y et si on crée une rot pos
                                || (( MovingCube.position.y == firstColy)  &&  (MovingCube.rotation.z <  firstRotz )) // ou si nvellePosY = colPosY et nouvelle rotation neg: si on bouge pas en y mais en rotation nèg
                                || (( MovingCube.position.y == firstColy)  &&  (MovingCube.rotation.z >  firstRotz )) // ou si nvellePosY = colPosY et nouvelle rotation pos: si on bouge pas en y mais en rotation pos
                                || (( MovingCube.position.y >  firstColy)  &&  (MovingCube.rotation.z == firstRotz )) // ou si nvellePosY > colPosY et pas de rotation : Si on bouge en y et on a une rotation nulle
                            ) 

                            {
                                MovingCube.material.color.setHex(0xE3DAC9);
                                wall.material.color.setHex(0xE3DAC9);
                                detectionText("");
                            // appendText((cptAffichage * 0.1).toFixed(1) + " mm");
                            // appendText("x = " + MovingCube.position.x + " y = " + MovingCube.position.y + " z = " +  MovingCube.position.z + " Rotation = " +  Rotation);
                                appendText("x = " + (MovingCube.position.x).toFixed(1) + " y = " + (MovingCube.position.y).toFixed(1) + " z = " +  (MovingCube.position.z).toFixed(1) + " Rotation = " +  (MovingCube.rotation.z).toFixed(2));
                                //nbCollision = false;
                        
                            }  
                    }
    }

}


function render()
{   
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    controls.update();
    update();
}

function RemoveMandibule() 
{
    scene.remove( wall );
     wall.name = '';
}

function RemoveMaxillaire() 
{
    scene.remove( MovingCube );
     MovingCube.name = '';
}

function AddMandibule() 
{
    scene.add( wall );
     wall.name = 'mandibule';
}

function AddMaxillaire() 
{
    scene.add( MovingCube );
     MovingCube.name = 'maxillaire';
}
