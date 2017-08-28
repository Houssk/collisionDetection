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
                mesh.name = 'obeject';
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
    var vertices = pointsOfIntersection.vertices;
    var holes = [] ;
    var triangles;
    var geometry = pointsOfIntersection.clone();

    triangles = THREE.ShapeUtils.triangulateShape( vertices, holes  );
    for( var i = 0; i < triangles.length; i++ ){
        geometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
    }
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();
    geometry.mergeVertices();
    geometry.computeFaceNormals();
    var material = new THREE.MeshBasicMaterial( {color: 0xFFFF00} );
    console.log('pointsOfIntersection',geometry);
    var mesh = new THREE.Mesh( geometry, material );
    var object = new THREE.Object3D();
    object.add(mesh);
    scene.add(object);
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
    };
}