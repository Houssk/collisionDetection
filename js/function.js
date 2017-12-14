/**
 * Created by Utilisateur on 27/07/2017.
 */

 
/**
 * @param perspective number
 * @param wdth number
 * @param height number
 * @param {x, y, z} Three.Position  
 */
 function addCamera(perspective,width,height,x,y,z) {
    var camera = new THREE.PerspectiveCamera( perspective, width / height, 1, 20000 );
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    return camera;
}

function addLighting(){
    var ambientLight = new THREE.AmbientLight(0x202020);
    scene.add(ambientLight); 
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,500);
    scene.add(light);
    var directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.38);
    directionalLight4.position.set(0,1,-50);
    scene.add(directionalLight4);
}

/**
 * 
 * @param {*string} link 
 */
function loadObject (link) {
    var loader = new THREE.OBJLoader();
    var container = new THREE.Object3D();
    loader.load( link , function ( object ) {
        object.traverse(function (child) {
            if(child instanceof THREE.Mesh){
                var geometry  =  new THREE.Geometry().fromBufferGeometry(child.geometry);
                var material =  new THREE.MeshPhongMaterial( { color: 0xE3DAC9});
                var mesh  = new THREE.Mesh(geometry, material);
                console.log(mesh.material);
                mesh.name = 'object';
                container.add( mesh );
            }
        });
    });
    return container;
}


/**
 * 
 * @param {*} planeTable 
 * @param {*} obj 
 */
		

var verticesPoint = 0;
var shapePts = 0;



function drawIntersectionPoints(planeTable,obj) {
    var pointsOfIntersection = new THREE.Geometry();
   for (var i = 0 ; i< planeTable.length; i++) {
       var a = new THREE.Vector3(),
           b = new THREE.Vector3(),
           c = new THREE.Vector3();
       var planePointA = new THREE.Vector3(),
           planePointB = new THREE.Vector3(),
           planePointC = new THREE.Vector3();

       var lineAB = new THREE.Line3(),
           lineBC = new THREE.Line3(),
           lineCA = new THREE.Line3();

       var pointOfIntersection = new THREE.Vector3();
      
       var mathPlane = new THREE.Plane();

       planeTable[i].localToWorld(planePointA.copy(planeTable[i].geometry.vertices[planeTable[i].geometry.faces[0].a]));
       planeTable[i].localToWorld(planePointB.copy(planeTable[i].geometry.vertices[planeTable[i].geometry.faces[0].b]));
       planeTable[i].localToWorld(planePointC.copy(planeTable[i].geometry.vertices[planeTable[i].geometry.faces[0].c]));
       mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

       obj.geometry.faces.forEach(function(face) {
           obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
           obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
           obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
           lineAB = new THREE.Line3(a, b);
           lineBC = new THREE.Line3(b, c);
           lineCA = new THREE.Line3(c, a);

           setPointOfIntersection(pointOfIntersection,pointsOfIntersection,lineAB, mathPlane);
           setPointOfIntersection(pointOfIntersection,pointsOfIntersection,lineBC, mathPlane);
           setPointOfIntersection(pointOfIntersection,pointsOfIntersection,lineCA, mathPlane);

       });
       var pointsMaterial = new THREE.PointsMaterial({
           size: 1,
           color: "blue"
       });

       var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
     
       scene.add(points);
       var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
       var line = new THREE.LineSegments( pointsOfIntersection, lineMaterial );
       scene.add( line );

}      

    verticesPoint = pointsOfIntersection.vertices;

    var holes =[];// = pointsOfIntersection.holes;
    var triangles;
    var geometry = pointsOfIntersection.clone();

    triangles =  THREE.ShapeUtils.triangulateShape(verticesPoint, holes  );
    for( var i = 0; i < triangles.length; i++ ){
            geometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1],triangles[i][2] ));  
        } 

  //  geometry.computeVertexNormals();
   // geometry.computeFaceNormals();
   // geometry.mergeVertices();
    //geometry.computeVertexNormals();

    var material = new THREE.MeshBasicMaterial({color: 0xFFFF00});
    //console.log('pointsOfIntersection',geometry);
    var mesh = new THREE.Mesh( geometry, material );
    var object = new THREE.Object3D();
    object.name = 'simple';
    mesh.name = 'simple mesh';
    object.add(mesh);
    return mesh;
}
/**
 * 
 * @param {*} pointOfIntersection 
 * @param {*} pointsOfIntersection 
 * @param {*} line 
 * @param {*} plane 
 */

function setPointOfIntersection(pointOfIntersection,pointsOfIntersection,line, plane) {

    pointOfIntersection = plane.intersectLine(line);
    if (pointOfIntersection) {
        pointsOfIntersection.vertices.push(pointOfIntersection.clone());   
    }

}

 /*THREE.ShapeUtils.triangulateShapeSansE = function(contour, holes) {
      function removeDupEndPts(points) {
          var l = points.length;
          if (l > 2 && points[l - 1].equals(points[0])) {
              points.pop();
          }
      }
      function addContour(vertices, contour) {
          for (var i = 0; i < contour.length; i++) {
              vertices.push(contour[i].x);
              vertices.push(contour[i].y);
              vertices.push(contour[i].z);
          }
         // console.log(vertices);
      }
      removeDupEndPts(contour);
      holes.forEach(removeDupEndPts);
      var vertices = [];
      addContour(vertices, contour);
      var holeIndices = [];
      var holeIndex = contour.length;
      for (i = 0; i < holes.length; i++) {
          holeIndices.push(holeIndex);
          holeIndex += holes[i].length;
          addContour(vertices, holes[i]);
      }
      var result = earcut(vertices, holeIndices, 3);
      //console.log(holeIndices);
      var grouped = [];
      for (var i = 0; i < result.length; i +=4) {
          grouped.push(result.slice(i, i + 3));
      }
      return grouped;
  }*/

function intersection(mesh,mesh2) {
    var geo = mesh;
    var geo2 = mesh2;
    console.log(geo);
    var object1 = new ThreeBSP(geo);
    var object2  = new ThreeBSP(geo2);
    var intersect_bsp = object1.intersect( object2 );
    var result = intersect_bsp.toMesh(new THREE.MeshLambertMaterial( {color:0x0000FF})); //ambient: 0xCECECE, 
    var object = new THREE.Object3D();
    object.add(result);
    scene.add(result);
    return result;
}


function subtract(mesh,mesh2) {
        console.log("boucle subtract");
	    var geo = mesh;
		var geo2 = mesh2;
		var object1 = new ThreeBSP(geo);
		var object2  = new ThreeBSP(geo2);
		var subtract_bsp = object1.subtract( object2 );
		resultSubtract = subtract_bsp.toMesh(new THREE.MeshLambertMaterial( {color:0xE3DAC9 , emissive:0xE3DAC9})); 
		scene.add( resultSubtract );
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
		scene.add( resultUnion );
        resultUnion.name = "Max + Man";
        return resultUnion;
}//

    
function saveContourSTL( scene, name ){ 
  var exporter = new THREE.STLExporter();
  var stlString = exporter.parse(scene);
 var blob = new Blob([stlString], {type: 'text/plain'});
  saveAs( blob, name + '.stl');
}


function sqr(a) {
    return a*a;
}
 
function Distance(x1, y1, x2, y2) {
    return Math.sqrt(sqr(y2 - y1) + sqr(x2 - x1));
}

   function addGouttiere(){
        var extrudeSettings = { amount: 100,  bevelEnabled: true, bevelSegments: 2, steps: 150 	};
		 var distanceZ = Distance(particle3D[1].position.z,particle3D[1].position.y,particle3D[2].position.z,particle3D[2].position.y);
        spline = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(particle3D[0].position.x ,particle3D[0].position.y,particle3D[0].position.z),
            new THREE.Vector3( particle3D[1].position.x ,particle3D[1].position.y,particle3D[1].position.z + distanceZ),
            new THREE.Vector3(particle3D[2].position.x ,particle3D[2].position.y,particle3D[2].position.z  )    
            );


        var geometry = new THREE.Geometry();
        geometry.vertices = spline.getPoints( 50 );
        var materialCurve =new THREE.LineBasicMaterial( { color : 0x0000ff } );
        var curveObject = new THREE.Line( geometry, materialCurve );
        scene.add(curveObject);
       
        extrudeSettings.extrudePath = spline;
			var tube = new THREE.TubeGeometry(extrudeSettings.extrudePath, 5, 8, 8, false);
            gout = new THREE.Mesh(tube, new THREE.MeshLambertMaterial( { color: 0x00ff11} ));
            var boxgeo = new THREE.BoxGeometry(80, 4, distanceZ+10);
            var box = new THREE.Mesh(boxgeo,new THREE.MeshLambertMaterial( { color: 0x00ff11} ));
            box.position.y= mandibule.position.y;
            box.position.z = mandibule.position.z + 20;
            scene.add(box);
           
           
           gouttiere = intersection(box,gout);
           scene.remove(box);
            resultUnion = union(maxillaire,mandibule);
            subtract(gouttiere,resultUnion);
            scene.remove(maxillaire);
            scene.remove(mandibule);
            scene.remove(resultUnion);
            scene.remove(gouttiere);
            scene.remove(curveObject);
            scene.remove(particle3D[0]);
            scene.remove(particle3D[1]);
            scene.remove(particle3D[2]);
           // scene.remove(particle3D[3]);
            saveContourSTL( scene, "gouttiere bohn 1000" );
    }