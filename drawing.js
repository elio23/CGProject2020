var gl;
var baseDir;
var shaderDir;
var program;

var viewMatrix;
var perspectiveMatrix;


var objects = [];

//Parameters for Camera
var cx = -40.0;
var cy = 25.0;
var cz = 0.0;
var elevation = -20.0;
var angle = 90.0;
var roll = 0.01;

//object used to store model data after being loaded
var loadedModelData = function(vao,indicesLength,texture) {
  this.vao = vao;
  this.indicesLength = indicesLength;
  this.texture = texture;
};

//---------3D Models declarations---------------
var bedModel;
var bedModelStr = 'models/bed/bed.json';
var bedModelTexture = 'models/bed/bed_d.png';

var chairModel;
var chairModelStr = 'models/chair/chair.json';
var chairModelTexture = 'models/chair/chair.png';

var closetModel;
var closetModelStr = 'models/closet/closet.json';
var closetModelTexture = 'models/closet/closet.png';

var sofaModel;
var sofaModelStr = 'models/sofa/sofa.json';
var sofaModelTexture = 'models/sofa/verde.jpg';

var sofa2Model;
var sofa2ModelStr = 'models/sofa2/sofa2.json';
var sofa2ModelTexture = 'models/sofa2/mufiber03.png';

var wallModel;
var wallModelStr = 'models/empty_room/EmptyRoom.json';
var wallModelTexture = 'model/empty_room/Wall.jpg';

//TODO for each 3d model
//...

//----------------------------------------------

function main() {

  //Setting up mouse events
  var canvas = document.getElementById("c");
  canvas.addEventListener("mousedown", doMouseDown, false);
  canvas.addEventListener("mouseup", doMouseUp, false);
  canvas.addEventListener("mousemove", doMouseMove, false);

  //Setting up keyboard events
  //'window' is a JavaScript object (if "canvas", it will not work)
  window.addEventListener("keyup", keyFunctionUp, false);
  window.addEventListener("keydown", keyFunctionDown, false);

  //Setting up lights
  var dirLightAlpha = -utils.degToRad(60);
  var dirLightBeta  = -utils.degToRad(120);
  var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
              Math.sin(dirLightAlpha), Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)];
  var directionalLightColor = [1.0, 1.0, 1.0];


  //SET Global states (viewport size, viewport background color, Depth test)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  //get uniforms from shaders
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  var lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
  var lightColorHandle = gl.getUniformLocation(program, 'lightColor');
  var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');

  //uniform for textures location
  var textLocation = gl.getUniformLocation(program, "u_texture");


  //-----------------loading models--------------------
  var bed = loadModel(bedModel,bedModelTexture);
  var chair = loadModel(chairModel,chairModelTexture);
  var closet = loadModel(closetModel,closetModelTexture);
  var sofa = loadModel(sofaModel,sofaModelTexture); //Actually this is a 3d pallet model with a sofa texture
  var sofa2 = loadModel(sofa2Model,sofa2ModelTexture);
  var wall = loadModel(wallModel, wallModelTexture)
  //TODO for each furniture model
  //....
  //---------------------------------------------------


  //-------------Define the scene Graph----------------

  var roomNode = new Node ();
  roomNode.localMatrix = getLocalMatrix([0.0,0.0,0.0],[0.0,0.0,0.0], [1,1,1]);
  roomNode.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: bed.vao,
    indicesLength: bed.indicesLength,
    texture: bed.texture,
  };

  var wallNode = new Node();

  wallNode.localMatrix = getLocalMatrix([1, 0, 5],[0.0,0.0,0.0],[8,8,8]);
  wallNode.collider = [[-9.0, 0.0, 5.0], 3.0]

  var wallBody = new Node();

  wallBody.localMatrix = getLocalMatrix([0.0,0.1,0.0],[0.0,0.0,0.0], [1,1,1]);
  wallBody.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: wall.vao,
    indicesLength: wall.indicesLength,
    texture: wall.texture,
  };


  var bedNode = new Node();

  bedNode.localMatrix = getLocalMatrix([-9.0,0.0,5.0],[0.0,0.0,0.0],[1.0,1.0,1.0]);
  bedNode.collider = [[-9.0, 0.0, 5.0], 3.0]

  var bedBody = new Node();

  bedBody.localMatrix = getLocalMatrix([0.0,0.1,0.0],[0.0,0.0,0.0], [8.0,8.0,8.0]);
  bedBody.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: bed.vao,
    indicesLength: bed.indicesLength,
    texture: bed.texture,
  };

  var chairNode = new Node();
  chairNode.localMatrix = getLocalMatrix([1.0,0.0,-10.0],[0.0,0.0,0.0], [1.0,1.0,1.0]);
  chairNode.collider = [[1.0, 0.0, -10.0], 3.0]

  var chairBody = new Node();
  chairBody.localMatrix = getLocalMatrix([100, 0,0.0],[-90.0,0.0,0.0], [0.1,0.1,0.1]);
  chairBody.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: chair.vao,
    indicesLength: chair.indicesLength,
    texture: chair.texture,
  };

  var closetNode = new Node();
  closetNode.localMatrix = getLocalMatrix([31.0,0.0,-10.0],[0.0,0.0,0.0], [1.0,1.0,1.0]);
  closetNode.collider = [[31.0, 0.0, -10.0], 3.0]

  var closetBody = new Node();
  closetBody.localMatrix = getLocalMatrix([0.0,0.62,0.0],[0.0,180.0,0.0], [27.0,27.0,27.0]);
  closetBody.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: closet.vao,
    indicesLength: closet.indicesLength,
    texture: closet.texture,
  };

  var sofaNode = new Node();
  sofaNode.localMatrix = getLocalMatrix([51.0,0.0,-10.0],[0.0,0.0,0.0], [1.0,1.0,1.0]);
  sofaNode.collider = [[51.0, 0.0, -10.0], 3.0]

  var sofaBody = new Node();
  sofaBody.localMatrix = getLocalMatrix([0.0,-5.0,0.0],[0.0,180.0,0.0], [1.0,1.0,1.0]);
  sofaBody.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: sofa.vao,
    indicesLength: sofa.indicesLength,
    texture: sofa.texture,
  };

  var sofa2Node = new Node();
  sofa2Node.localMatrix = getLocalMatrix([0.0,0.0,30.0],[0.0,0.0,0.0], [1.0,1.0,1.0]);
  sofa2Node.collider = [[0.0, 0.0, 30.0], 3.0]

  var sofa2Body = new Node();
  sofa2Body.localMatrix = getLocalMatrix([0.0,0.0,-1],[0.0,180.0,0.0], [12.0,12.0,12.0]);
  sofa2Body.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: sofa2.vao,
    indicesLength: sofa2.indicesLength,
    texture: sofa2.texture,
  };

  //TODO for each furniture model
  //...

  //building the scene graph

  bedBody.setParent(bedNode);
  bedNode.setParent(roomNode);

  chairBody.setParent(chairNode);
  chairNode.setParent(roomNode);

  closetBody.setParent(closetNode);
  closetNode.setParent(roomNode);

  sofaBody.setParent(sofaNode);
  sofaNode.setParent(roomNode);

  sofa2Body.setParent(sofa2Node);
  sofa2Node.setParent(roomNode);

  wallBody.setParent(wallNode);
  wallNode.setParent(roomNode);

  //TODO for each furniture model
  //...

  //listing all models nodes
  objects = [
      roomNode,
      bedBody,
      chairBody,
      closetBody,
      sofaBody,
      sofa2Body,
      wallBody
      //TODO for each furniture model
      //...
  ];
  //---------------SceneGraph defined-------------------

  requestAnimationFrame(drawScene);

  // Draw the scene called for each frame
  function drawScene(time) {
    time *= 0.001;

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //compute aspect ratio
    var aspect = gl.canvas.width / gl.canvas.height;

    //compute new camera position
    if(movingRight) moveCameraRight();
    if(movingLeft) moveCameraLeft();
    if(movingForward) moveCameraForward();
    if(movingBackward) moveCameraBackward();

    //compute viewMatrix for camera
    viewMatrix = utils.multiplyMatrices(
        utils.MakeRotateZMatrix(-roll),utils.MakeView(cx, cy, cz, elevation, angle));

    // Update all world matrices in the scene graph
    roomNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function(object) {

      gl.useProgram(object.drawInfo.programInfo);

      perspectiveMatrix = utils.MakePerspective(60,aspect,1.0,2000.0);

      var projectionMatrix = utils.multiplyMatrices(viewMatrix, object.worldMatrix);
      projectionMatrix = utils.multiplyMatrices(perspectiveMatrix,projectionMatrix);
      var normalMatrix = utils.invertMatrix(utils.transposeMatrix(object.worldMatrix));

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, object.drawInfo.texture);
      gl.uniform1i(textLocation, 0);

      gl.uniform3fv(materialDiffColorHandle, object.drawInfo.materialColor);
      gl.uniform3fv(lightColorHandle,  directionalLightColor);
      gl.uniform3fv(lightDirectionHandle,  directionalLight);

      gl.bindVertexArray(object.drawInfo.vertexArray);
      gl.drawElements(gl.TRIANGLES, object.drawInfo.indicesLength, gl.UNSIGNED_SHORT, 0 );
    });

    requestAnimationFrame(drawScene);
  }
}

async function init(){
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    console.log("basedir = " + baseDir);
    shaderDir = baseDir+"shaders/";

      var canvas = document.getElementById("c");
      gl = canvas.getContext("webgl2");
      if (!gl) {
        document.write("GL context not opened");
        return;
      }
      utils.resizeCanvasToDisplaySize(gl.canvas);

      await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
        console.log(shaderText[0]);
        console.log(shaderText[1]);
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

      program = utils.createProgram(gl, vertexShader, fragmentShader);
    });

  gl.useProgram(program);

  //################################# Load Models #####################################
  //This loads the json model in the models variables previously declared

  //JSON models
  await utils.get_json(bedModelStr, function(loadedModel){bedModel = loadedModel;});
  await utils.get_json(chairModelStr, function(loadedModel){chairModel = loadedModel;});
  await utils.get_json(closetModelStr, function(loadedModel){closetModel = loadedModel;});
  await utils.get_json(sofaModelStr, function(loadedModel){sofaModel = loadedModel;});
  await utils.get_json(sofa2ModelStr, function(loadedModel){sofa2Model = loadedModel;});
  await utils.get_json(wallModelStr, function(loadedModel){wallModel = loadedModel;});


  //Obj models
  //...

  //TODO for each 3d model
  //...
  //###################################################################################

    main();
}

window.onload = init();

/**function that loads a 3D model and its texture*/
function loadModel(model, modelTexture){

  //get uniforms from shaders
  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var uvAttributeLocation = gl.getAttribLocation(program, "a_uv");

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  //Here we extract the position of the vertices, the normals, the indices, and the uv coordinates
  var vertices, normals, indices, texCoords;
  if(model.meshes == null){
    //Obj model
    vertices = model.vertices;
    normals = model.normals;
    indices = model.indices;
    texCoords = model.textures;
  }
  else {
    //Json model
    console.log(model);
    vertices = model.meshes[0].vertices;
    normals = model.meshes[0].normals;
    indices = [].concat.apply([], model.meshes[0].faces);
    texCoords = (model.meshes[0].texturecoords!=null)?model.meshes[0].texturecoords[0]:null;
  }

  gl.bindVertexArray(vao);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  if(texCoords!=null){
    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  }

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  var texture = loadTexture(modelTexture);

  return new loadedModelData(vao,indices.length, texture);

}

/**Function used to load a texture*/
function loadTexture(modelTexture){
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  var image = new Image();
  image.src = baseDir+modelTexture;
  image.onload= function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  return texture;
}

function getLocalMatrix(position,rotation,scale){
  let matricesList = [
      utils.MakeScaleMatrix(scale[0],scale[1],scale[2]),
      utils.MakeRotateXMatrix(rotation[0]),
      utils.MakeRotateYMatrix(rotation[1]),
      utils.MakeRotateZMatrix(rotation[2]),
      utils.MakeTranslateMatrix(position[0],position[1],position[2])
  ];
  return utils.multiplyListOfMatrices(matricesList);
}

//----------------------------Mouse events functions-------------------------------------------
var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
const maxElevation = 60;  //max angle for elevation (to limit vertical camera rotations)
function doMouseDown(event) {
  lastMouseX = event.pageX;
  lastMouseY = event.pageY;
  mouseState = true;
}
function doMouseUp(event) {
  lastMouseX = -100;
  lastMouseY = -100;
  mouseState = false;
}
function doMouseMove(event) {
  if(mouseState) {
    var dx = event.pageX - lastMouseX;
    var dy = lastMouseY - event.pageY;
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;

    if((dx !== 0) || (dy !== 0)) {
      angle = angle + 0.5 * dx;
      elevation = elevation + ((Math.abs(elevation + 0.5*dy)>maxElevation)?0:0.5*dy); //limit vertical rotations
    }
  }
}
//------------------------------------------------------------------------------------------------

//-------------------------------------Input keys-------------------------------------------------
var keys = [];

var keyFunctionDown =function(e) {
  if(!keys[e.keyCode]) {
    keys[e.keyCode] = true;
    switch(e.keyCode) {
      case 37:
        //console.log("KeyUp   - Dir LEFT");
        movingLeft = true;
        break;
      case 39:
        //console.log("KeyUp   - Dir RIGHT");
        movingRight = true;
        break;
      case 38:
        //console.log("KeyUp   - Dir UP");
        movingForward = true;
        break;
      case 40:
        //console.log("KeyUp   - Dir DOWN");
        movingBackward = true;
        break;
      case 65:
        //console.log("KeyUp   - Dir LEFT");
        movingLeft = true;
        break;
      case 68:
        //console.log("KeyUp   - Dir RIGHT");
        movingRight = true;
        break;
      case 87:
        //console.log("KeyUp   - Dir UP");
        movingForward = true;
        break;
      case 83:
        //console.log("KeyUp   - Dir DOWN");
        movingBackward = true;
        break;
    }
  }
//console.log(e.keyCode);
};

var keyFunctionUp =function(e) {
  if(keys[e.keyCode]) {
    keys[e.keyCode] = false;
    switch(e.keyCode) {
      case 37:
        //console.log("KeyUp   - Dir LEFT");
        movingLeft = false;
        break;
      case 39:
        //console.log("KeyUp   - Dir RIGHT");
        movingRight = false;
        break;
      case 38:
        //console.log("KeyUp   - Dir UP");
        movingForward = false;
        break;
      case 40:
        //console.log("KeyUp   - Dir DOWN");
        movingBackward = false;
        break;
      case 65:
        //console.log("KeyUp   - Dir LEFT");
        movingLeft = false;
        break;
      case 68:
        //console.log("KeyUp   - Dir RIGHT");
        movingRight = false;
        break;
      case 87:
        //console.log("KeyUp   - Dir UP");
        movingForward = false;
        break;
      case 83:
        //console.log("KeyUp   - Dir DOWN");
        movingBackward = false;
        break;
    }
  }
//console.log(e.keyCode);
};

//-------------------------------------------------------------------------------------------------

//--------------------------First person camera movements------------------------------------------
var velocity = 0.3;
var movingRight = false;
var movingLeft = false;
var movingForward = false;
var movingBackward = false;

function moveCameraForward(){
  //console.log("direction = " +  angle);
  cz= cz - Math.cos(utils.degToRad(angle))*velocity;
  cx= cx + Math.sin(utils.degToRad(angle))*velocity;
}

function moveCameraLeft(){
  //console.log("direction = " +  angle);
  cz= cz + Math.cos(utils.degToRad(angle+90))*velocity;
  cx= cx - Math.sin(utils.degToRad(angle+90))*velocity;
}

function moveCameraRight(){
  //console.log("direction = " +  angle);
  cz= cz + Math.cos(utils.degToRad(angle-90))*velocity;
  cx= cx - Math.sin(utils.degToRad(angle-90))*velocity;
}

function moveCameraBackward(){
  //console.log("direction = " +  angle);
  cz= cz - Math.cos(utils.degToRad(angle+180))*velocity;
  cx= cx + Math.sin(utils.degToRad(angle+180))*velocity;
}

//---------------------------------------------------------------------------------------------------------

//-----------------------------------Raycast---------------------------------------------------------------


function raySphereIntersection(rayStartPoint, rayNormalisedDir, sphereCentre, sphereRadius){
  //Distance between sphere origin and origin of ray
  var l = [sphereCentre[0] - rayStartPoint[0], sphereCentre[1] - rayStartPoint[1], sphereCentre[2] - rayStartPoint[2]];
  var l_squared = l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
  //If this is true, the ray origin is inside the sphere so it collides with the sphere
  if(l_squared < (sphereRadius*sphereRadius)){
      console.log("ray origin inside sphere");
      return true;
  }
  //Projection of l onto the ray direction
  var s = l[0] * rayNormalisedDir[0] + l[1] * rayNormalisedDir[1] + l[2] * rayNormalisedDir[2];
  //The spere is behind the ray origin so no intersection
  if(s < 0){
      console.log("sphere behind ray origin");
      return false;
  }
  //Squared distance from sphere centre and projection s with Pythagorean theorem
  var m_squared = l_squared - (s*s);
  //If this is true the ray will miss the sphere
  if(m_squared > (sphereRadius*sphereRadius)){
      console.log("m squared > r squared");
      return false;
  }
  //Now we can say that the ray will hit the sphere
  console.log("hit");
  return true;

}

function myOnMouseUp(ev){
  //These commented lines of code only work if the canvas is full screen
  /*console.log("ClientX "+ev.clientX+" ClientY "+ev.clientY);
  var normX = (2*ev.clientX)/ gl.canvas.width - 1;
  var normY = 1 - (2*ev.clientY) / gl.canvas.height;
  console.log("NormX "+normX+" NormY "+normY);*/

  //This is a way of calculating the coordinates of the click in the canvas taking into account its possible displacement in the page
  var top = 0.0, left = 0.0;
  canvas = gl.canvas;
  while (canvas && canvas.tagName !== 'BODY') {
      top += canvas.offsetTop;
      left += canvas.offsetLeft;
      canvas = canvas.offsetParent;
  }
  console.log("left "+left+" top "+top);
  var x = ev.clientX - left;
  var y = ev.clientY - top;

  //Here we calculate the normalised device coordinates from the pixel coordinates of the canvas
  //console.log("ClientX "+x+" ClientY "+y);
  var normX = (2*x)/ gl.canvas.width - 1;
  var normY = 1 - (2*y) / gl.canvas.height;
  //console.log("NormX "+normX+" NormY "+normY);

  //We need to go through the transformation pipeline in the inverse order so we invert the matrices
  var projInv = utils.invertMatrix(perspectiveMatrix);
  var viewInv = utils.invertMatrix(viewMatrix);

  //Find the point (un)projected on the near plane, from clip space coords to eye coords
  //z = -1 makes it so the point is on the near plane
  //w = 1 is for the homogeneous coordinates in clip space
  var pointEyeCoords = utils.multiplyMatrixVector(projInv, [normX, normY, -1, 1]);
  //console.log("Point eye coords "+pointEyeCoords);

  //This finds the direction of the ray in eye space
  //Formally, to calculate the direction you would do dir = point - eyePos but since we are in eye space eyePos = [0,0,0]
  //w = 0 is because this is not a point anymore but is considered as a direction
  var rayEyeCoords = [pointEyeCoords[0], pointEyeCoords[1], pointEyeCoords[2], 0];


  //We find the direction expressed in world coordinates by multipling with the inverse of the view matrix
  var rayDir = utils.multiplyMatrixVector(viewInv, rayEyeCoords);
  //console.log("Ray direction "+rayDir);
  var normalisedRayDir = utils.normalize(rayDir);
  //console.log("normalised ray dir "+normalisedRayDir);
  //The ray starts from the camera in world coordinates
  var rayStartPoint = [cx, cy, cz];

  //We iterate on all the objects in the scene to check for collisions
  for(let i = 1; i < objects.length; i++){
      let collider = objects[i].parent.collider
      let hit = raySphereIntersection(rayStartPoint, normalisedRayDir, collider[0], collider[1]);
      if (hit) {
          console.log("hit sphere number "+i);
          colours[i] = [Math.random(), Math.random(), Math.random(), 1];
      }
  }
}


window.addEventListener("mouseup", myOnMouseUp);
