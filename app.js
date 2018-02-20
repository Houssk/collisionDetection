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

var loaderGout = new THREE.OBJLoader();
var cheminGout = "gouttiere.obj";

var raycaster;
var mouse;
var particle3D = [];

var parent = new THREE.Object3D();

init();
render();

// FUNCTIONS
function init()
{  

    // SCENE
    scene = new THREE.Scene();
    
    group = new THREE.Group();
	
	scene.add( group );
    scene.add(parent);
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
   // scenePts.add(light);

    /**
     * Axis Helper
     */
    var axis = new THREE.AxisHelper(150);
    scene.add(axis);
  
    var loader2 = new THREE.OBJLoader();
    //var cheminMaxillaire="maxillaireInitial_Bohn_2000.obj";
    var cheminMaxillaire="maxillaire1000.obj";
    var loader = new THREE.OBJLoader();
   // var cheminMand= "burdin_ruffio.obj";
    var cheminMand= "mandibule1000.obj";

    loader2.load(cheminMaxillaire,function(object){
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                cubeGeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                wireMaterial = new THREE.MeshPhongMaterial( { color: 0xE3DAC9});
                MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
                MovingCube.name = 'maxillaire';
                parent.add( MovingCube );
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
               // wall.position.set(0, -5, 0);
                parent.add(wall);
                collidableMeshList.push(wall); // permet de garder en mémoire l'objet qui ne doit pas rentrer en collision avec l'objet en mouvement.

        }})
        
    });

    raycaster=new THREE.Raycaster();
    mouse = new THREE.Vector2();

    particleMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000});
    document.addEventListener('dblclick', onDocumentMouseDown, false);

    function onDocumentMouseDown(event) {
  
        event.preventDefault();
        mouse.x = ( (event.clientX  ) /  window.innerWidth ) * 2 - 1;
        mouse.y = -( (event.clientY ) /  window.innerHeight ) * 2 + 1;
       
       // console.log("mouse", mouse.x, mouse.y);
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObject(wall);
        if (intersects.length > 0) {
            var pointSphere = new THREE.SphereGeometry(1, 15, 15);
            particle = new THREE.Mesh(pointSphere, particleMaterial);
            particle.position.copy(intersects[0].point);
             console.log("point",particle.position);
            particle3D.push(particle);
            wall.add(particle);
        }
    }
}

    left = document.getElementById('left');
    right = document.getElementById('right');
    up = document.getElementById('up');
    down = document.getElementById('down');


function sqr(a) {
    return a*a;
}
 
function Distance(x1, y1, x2, y2) {
    return Math.sqrt(sqr(y2 - y1) + sqr(x2 - x1));
}

    function addGouttiere(){
        var extrudeSettings = { amount: 100,  bevelEnabled: true, bevelSegments: 2, steps: 150 	};
		 var distanceZ = Distance(particle3D[1].position.z,particle3D[1].position.y,particle3D[2].position.z,particle3D[2].position.y);
          var sphereGeo = new THREE.SphereGeometry(1,32,32);
          var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
          var sphere = new THREE.Mesh( sphereGeo, material );
           sphere.position.set(((particle3D[2].position.x + particle3D[0].position.x)/2),particle3D[2].position.y -3 ,((particle3D[1].position.z + particle3D[0].position.z))/2);
        var B = Distance(particle3D[1].position.z,particle3D[1].position.y,sphere.position.z,sphere.position.y);
        var A = Distance(particle3D[1].position.z,sphere.position.y,sphere.position.z,sphere.position.y);
        inclinaison = Math.acos(A/B);
        var distanceX = Distance(particle3D[2].position.x ,particle3D[2].position.y , particle3D[0].position.x, particle3D[0].position.y);
       
          
          parent.add(sphere);
          spline = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(particle3D[0].position.x ,particle3D[0].position.y,particle3D[0].position.z),
            new THREE.Vector3( particle3D[1].position.x ,particle3D[1].position.y,particle3D[1].position.z +40),
            new THREE.Vector3(particle3D[2].position.x ,particle3D[2].position.y,particle3D[2].position.z  )    
            );

        var geometry = new THREE.Geometry();
        geometry.vertices = spline.getPoints( 20 );
        var materialCurve =new THREE.LineBasicMaterial( { color : 0x0000ff } );
        var curveObject = new THREE.Line( geometry, materialCurve );
        wall.add(curveObject);
       
        extrudeSettings.extrudePath = spline;
			var tube = new THREE.TubeGeometry(extrudeSettings.extrudePath, 15, 5, 15, false);
            gout = new THREE.Mesh(tube, new THREE.MeshLambertMaterial( { color: 0x00ff11} ));
            var boxgeo = new THREE.BoxGeometry(distanceX +5, 2, distanceZ +15);
            var box = new THREE.Mesh(boxgeo,new THREE.MeshLambertMaterial( { color: 0x00ff11} ));
          //  box.position.copy(sphere.position);
            //box.rotation.x = inclinaison;
            console.log(box.position);
            console.log(gout.position);
            box.rotation.x = inclinaison;
            box.position.copy(sphere.position);
        
            gout.add(box); 
           
           wall.add(gout);
           //gout.add(box);
           gouttiere = intersection(box,gout);
           gouttiere.name == 'gouttiere';
           parent.add(gouttiere);
          gout.remove(box);
            resultUnion = union(MovingCube,wall);
            subtract(gouttiere,resultUnion);
           //subtract(gouttiere,wall);
            parent.remove(MovingCube);
            parent.remove(wall);
            parent.remove(resultUnion);
            parent.remove(sphere);
            wall.remove(gout);
            parent.remove(gouttiere);
            wall.remove(curveObject);
            wall.remove(particle3D[0]);
            wall.remove(particle3D[1]);
            wall.remove(particle3D[2]);
           // parent.remove(particle3D[3]);
            saveContourSTL( scene, "gouttiere realini" );
    }


function saveContourOBJ( scene, name ){ 
  var exporter = new THREE.OBJExporter();
  var objString = exporter.parse(scene);
  var blob = new Blob([objString], {type: 'text/plain'});
  saveAs( blob, name + '.obj');
}

function saveContourSTL( scene, name ){ 
  var exporter = new THREE.STLExporter();
  var stlString = exporter.parse(scene);
 var blob = new Blob([stlString], {type: 'text/plain'});
  saveAs( blob, name + '.stl');
}


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

var MovePlane = 0.1;
var RotPlane = 0.01;

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
        planeRightMan.onclick = function()
        {
            plane.rotation.x += RotPlane;
        }

        planeLeftMan.onclick = function()
        {
            plane.rotation.x -= RotPlane;
        }

        ValiderPlanMan.onclick = function()
        {
            intersectionPlanMan();
            //intersection(wall,plane);
            scene.remove(wall);
            scene.remove(plane);
            saveContourSTL(scene,"contour STL");
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

                planeRightMax.onclick = function()
        {
            plane2.rotation.x += RotPlane;
        }

        planeLeftMax.onclick = function()
        {
            plane2.rotation.x -= RotPlane;
        }

        ValiderPlanMax.onclick = function()
        {
            intersectionPlanMax();
            scene.remove(MovingCube);
            scene.remove(plane2);
            saveContourOBJ(scene,"contour"); 
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
            var pointsMaterial = new THREE.PointsMaterial({size: .5, color: "blue"});
            var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
            scene.add(points);
             var lines = new THREE.LineSegments(pointsOfIntersection, new THREE.LineBasicMaterial({color: 0xff0000}));
            scene.add(lines);
        }
  });
      var verticesSTL = pointsOfIntersection.vertices;//wall.geometry.vertices;\par
    var holes = [];
    var triangles;//, meshContour;\par
    var geometrySTL = new THREE.Geometry();
    var materialSTL = new THREE.MeshBasicMaterial( { color: 0x00FF00,wireframe:true});
    geometrySTL.vertices = verticesSTL;
    //geometrySTL.mergeVertices();
    triangles = THREE.ShapeUtils.triangulateShape(verticesSTL,holes );
    for( var i = 0; i < triangles.length; i++ ){

        geometrySTL.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));

    }

    meshContour = new THREE.Mesh( geometrySTL, materialSTL );
    scene.add(meshContour);
 
}
var  meshContour;

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
  lines2.name="Contour Maxillaire";
        }

  });
}



function intersection(mesh,mesh2) {

	    var geo = mesh;
		var geo2 = mesh2;
		var object1 = new ThreeBSP(geo);
		var object2  = new ThreeBSP(geo2);
		var intersect_bsp = object1.intersect( object2 );
		var result = intersect_bsp.toMesh(new THREE.MeshLambertMaterial( {color:0x0000FF})); 
		wall.add( result );
        return result;
}//


function subtract(mesh,mesh2) {
        console.log("boucle subtract");
	    var geo = mesh;
		var geo2 = mesh2;
		var object1 = new ThreeBSP(geo);
		var object2  = new ThreeBSP(geo2);
		var subtract_bsp = object1.subtract( object2 );
		resultSubtract = subtract_bsp.toMesh(new THREE.MeshLambertMaterial( {color:0xE3DAC9 , emissive:0xE3DAC9})); 
		parent.add( resultSubtract );
        resultSubtract.name="empreinte";
    }//

var resultSubtract;
var resultUnion;
function union(mesh,mesh2) {
        console.log("boucle union");
	    var geo = mesh;
		var geo2 = mesh2;
		var object1 = new ThreeBSP(geo);
		var object2  = new ThreeBSP(geo2);
		var subtract_bsp = object1.union( object2 );
		resultUnion = subtract_bsp.toMesh(new THREE.MeshLambertMaterial( { color:0x0000FF})); 
		parent.add( resultUnion );
        resultUnion.name = "Max + Man";
        return resultUnion;
}//


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
                       appendText("x = " + (MovingCube.position.x).toFixed(1) + " y = " + (MovingCube.position.y).toFixed(1) + " z = " +  (MovingCube.position.z).toFixed(1) + " Rotation = " +  (MovingCube.rotation.z).toFixed(2));
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
    parent.remove( wall );
     wall.name = '';
}

function RemoveMaxillaire() 
{
    parent.remove( MovingCube );
     MovingCube.name = '';
}

function AddMandibule() 
{
    parent.add( wall );
     wall.name = 'mandibule';
}

function AddMaxillaire() 
{
    parent.add( MovingCube );
     MovingCube.name = 'maxillaire';
}


