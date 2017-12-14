/**
 * Created by Houssam KARRACH on 25/10/2016.
 */

/**
 *
 * @param url
 * @constructor
 */
function Mandibule (url) {
    this.url = url;
    this.material = new THREE.MeshPhongMaterial( {
            color: 0xffffff,
        }
    );
}
/**
 *
 * @returns {url}
 */
Mandibule.prototype.getUrl = function () {
    return this.url;
}
/**
 *
 * @returns {THREE.MeshPhongMaterial|MeshPhongMaterial|*}
 */
Mandibule.prototype.getMaterial = function(){
    return this.material;
}
/**
 *
 * @param _object
 */
Mandibule.prototype.calculateDimensions= function(_object) {

    var absoluteMinX = 0, absoluteMaxX = 0, absoluteMinY = 0, absoluteMaxY = 0, absoluteMinZ = 0, absoluteMaxZ = 0;

    for (var i = 0; i < _object.children.length; i++) {
        _object.children[i].geometry.computeBoundingBox();
        absoluteMinX = Math.min(absoluteMinX,_object.children[i].geometry.boundingBox.min.x);
        absoluteMaxX = Math.max(absoluteMaxX,_object.children[i].geometry.boundingBox.max.x);
        absoluteMinY = Math.min(absoluteMinY,_object.children[i].geometry.boundingBox.min.y);
        absoluteMaxY = Math.max(absoluteMaxY,_object.children[i].geometry.boundingBox.max.y);
        absoluteMinZ = Math.min(absoluteMinZ,_object.children[i].geometry.boundingBox.min.z);
        absoluteMaxZ = Math.max(absoluteMaxZ,_object.children[i].geometry.boundingBox.max.z);
    }

    // set generic height and width values
    _object.depth = (absoluteMaxX - absoluteMinX) * _object.scale.x;
    _object.height = (absoluteMaxY - absoluteMinY) * _object.scale.y;
    _object.width = (absoluteMaxZ - absoluteMinZ) * _object.scale.z;

    // remember the original dimensions
    if (_object.originalDepth === undefined) _object.originalDepth = _object.depth;
    if (_object.originalHeight === undefined) _object.originalHeight = _object.height;
    if (_object.originalWidth === undefined) _object.originalWidth = _object.width;

    console.log("Depth: " + _object.depth + ", Height: " + _object.height + ", Width: " + _object.width);
}
/**
 *
 * @param geometry
 */
Mandibule.prototype.assignUVs =function(geometry) {

    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function(face) {

        var components = ['x', 'y', 'z'].sort(function(a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });
    geometry.uvsNeedUpdate = true;
}
/**
 *
 * @param mesh
 * @param plan1
 * @param plan2
 * @param material
 */
Mandibule.prototype.coupe = function(mesh,plan1,plan2,material){
    var mandibule_bsp = new ThreeBSP( mesh );
    var plan1Bsp = new ThreeBSP( plan1 );
    var plan2Bsp = new ThreeBSP( plan2 );
    var union_cube = plan1Bsp.union(plan2Bsp);
    var subtract_bsp = mandibule_bsp.subtract( union_cube );
    var result = subtract_bsp.toMesh( material );
    result.material.transparent = true;
    return result;
}
/**
 *
 * @param mesh
 * @param plan1
 * @param plan2
 * @param material
 */
Mandibule.prototype.coupe2 = function(mesh,plan1,plan2,material){
    // plan1.scale.y = 4;
    plan1.scale.z=2;
    //  plan1.position.y = plan1.position.y-1.5;
    //  plan2.scale.y = 4;
    plan2.scale.z=2;
    //  plan2.position.y = plan2.position.y-1.5;
    var mandibule_bsp = new ThreeBSP( mesh );
    var plan1Bsp = new ThreeBSP( plan1 );
    var plan2Bsp = new ThreeBSP( plan2 );
    var union_cube = plan1Bsp.union(plan2Bsp);
    var subtract_bsp = mandibule_bsp.subtract( union_cube );
    var result = subtract_bsp.toMesh( material );
    result.material.transparent = true;
    return result;
}
/**
 *
 * @param a
 * @param b
 * @returns {number}
 */
function compare(a,b) {
    if (a.x < b.x) return -1;
    if (a.x> b.x) return 1;
    return 0;
}
/**
 *
 * @param a
 * @param b
 * @returns {number}
 */
function compare2(a,b) {
    if (a.z < b.z) return -1;
    if (a.z> b.z) return 1;
    return 0;
}
/**
 *
 * @param geometry
 * @returns {Array}
 */
Mandibule.prototype.getMinMaxX = function (geometry) {
    var tableau = [];
    var tableauF = [];
    var object = {x:null,y:null,z :null};
    for(i=0 ; i< geometry.vertices.length ; i++ ){
        if(geometry.vertices[i].y>5 && geometry.vertices[i].z > 9.9 && geometry.vertices[i].z <10.1 ){
            object = {x:geometry.vertices[i].x ,y:geometry.vertices[i].y+10 ,z:geometry.vertices[i].z};
            tableau.push(object);
        }
    }
    tableauF = tableau.sort(compare);
  
    return tableauF;
}
/**
 *
 * @param geometry
 * @returns {Array}
 */
Mandibule.prototype.getMinZ = function (geometry) {
    var tableau = [];
    var tableauF = [];
    var object = {x:null,y:null,z:null};
    for(i=0 ; i< geometry.vertices.length ; i++ ){
        /*if(geometry.vertices[i].y<0 && geometry.vertices[i].x <0.3 && geometry.vertices[i].x > -0.3 ){
            object = {x:geometry.vertices[i].x ,y:geometry.vertices[i].y+10 , z:geometry.vertices[i].z };
            tableau.push(object);*/

             if(geometry.vertices[i].y<0 && geometry.vertices[i].x <0.3 && geometry.vertices[i].x > -0.3 ){
            object = {x:geometry.vertices[i].x ,y:geometry.vertices[i].y+10 , z:geometry.vertices[i].z };
            tableau.push(object);
        }
    }
    tableauF = tableau.sort(compare2);
    return tableauF;
}
Mandibule.prototype.getMaxYRigth = function (geometry){
    var tableau = [];
    var tableauF = [];
    var max = geometry.vertices[0].y;
    var xMax = 0;
    var zMax = 0;
    var min = geometry.vertices[0].y;
    var xMin=0;
    var zMin=0;
    var object = {x:null,y:null,z :null};
    for( var i = 0 ; i < geometry.vertices.length ; i++){
       // if(geometry.vertices[i].x > 0){
        if(geometry.vertices[i].x > 0){
            if (geometry.vertices[i].y > max ) {
                max = geometry.vertices[i].y;
                xMax=geometry.vertices[i].x;
                zMax = geometry.vertices[i].z;
            }
        }
        else {
            if (geometry.vertices[i].y > min) {
                min = geometry.vertices[i].y;
                xMin = geometry.vertices[i].x;
                zMin = geometry.vertices[i].z;
            }//  }
        }
    }
    object = {x:xMax ,y:max ,z:zMax};
    tableau.push(object);
    object = {x:xMin ,y:min ,z:zMin};
    tableau.push(object);
   // tableauF = tableau.sort(compare);
    console.log(tableau);
    return tableau;

}