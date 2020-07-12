var gl;
var baseDir;
var shaderDir;
var program;

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
  //---------------------------------------------------


  //-------------Define the scene Graph----------------
  var objects = [];

  var roomNode = new Node();
  roomNode.localMatrix = getLocalMatrix([0.0,0.0,0.0],[0.0,0.0,0.0], [1.0,1.0,1.0]);
  roomNode.drawInfo = {
    materialColor: [1.0, 0.0, 0.0], //red
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: bed.vao,
    indicesLength: bed.indicesLength,
    texture: bed.texture,
  };

  var bedNode = new Node();
  bedNode.localMatrix = getLocalMatrix([-9.0,1.0,5.0],[0.0,0.0,0.0],[1.0,1.0,1.0]);
  var bedBody = new Node();

  bedBody.localMatrix = getLocalMatrix([0.0,0.0,0.0],[0.0,0.0,0.0], [8.0,8.0,8.0]);
  bedBody.drawInfo = {
    materialColor: [1.0,1.0,1.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: bed.vao,
    indicesLength: bed.indicesLength,
    texture: bed.texture,
  };

  var chairNode = new Node();
  chairNode.localMatrix = getLocalMatrix([1.0,0.0,0.0],[0.0,0.0,0.0], [1.0,1.0,1.0]);

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

  bedBody.setParent(bedNode);
  bedNode.setParent(roomNode)
  chairBody.setParent(chairNode);
  chairNode.setParent(roomNode);

  var objects = [
    roomNode,
    bedBody,
    chairBody,
  ];
  //---------------SceneGraph defined-------------------

  requestAnimationFrame(drawScene);

  // Draw the scene.
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
    var viewMatrix = utils.multiplyMatrices(
        utils.MakeRotateZMatrix(-roll),utils.MakeView(cx, cy, cz, elevation, angle));

    // Update all world matrices in the scene graph
    roomNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function(object) {
      
      gl.useProgram(object.drawInfo.programInfo);

      var perspectiveMatrix = utils.MakePerspective(60,aspect,1.0,2000.0);

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
  await utils.get_json(bedModelStr, function(loadedModel){bedModel = loadedModel;});
  await utils.get_json(chairModelStr, function(loadedModel){chairModel = loadedModel;});
  //TODO for each 3d model
  //...
  //###################################################################################

    main();
}

window.onload = init();

/**function that loads a 3D model and its texture (texture still not working)*/
function loadModel(model, modelTexture){

  //get uniforms from shaders
  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var uvAttributeLocation = gl.getAttribLocation(program, "a_uv");

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  //Here we extract the position of the vertices, the normals, the indices, and the uv coordinates
  console.log(model);
  var vertices = model.meshes[0].vertices;
  var normals = model.meshes[0].normals;
  var indices = [].concat.apply([], model.meshes[0].faces);
  var texCoords = model.meshes[0].texturecoords[0];

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

  var uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(uvAttributeLocation);
  gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

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
  let matricesList = [utils.MakeScaleMatrix(scale[0],scale[1],scale[2]),utils.MakeRotateXMatrix(rotation[0]),utils.MakeRotateXMatrix(rotation[1]),utils.MakeRotateXMatrix(rotation[2]),utils.MakeTranslateMatrix(position[0],position[1],position[2])];
  console.log(utils);
  return utils.multiplyListOfMatrices(matricesList);
}

//----------------------------Mouse events functions-------------------------------------------
var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
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

    if((dx != 0) || (dy != 0)) {
      angle = angle + 0.5 * dx;
      elevation = elevation + 0.5 * dy;
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
    }
  }
//	console.log(e.keyCode);
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
  console.log("direction = " +  angle);
  cz= cz - Math.cos(utils.degToRad(angle))*velocity;
  console.log("Cos(direction) = " + Math.cos(utils.degToRad(angle)));
  cx= cx + Math.sin(utils.degToRad(angle))*velocity;
  console.log("Sin(direction) = " + Math.sin(utils.degToRad(angle)));
}

function moveCameraLeft(){
  console.log("direction = " +  angle);
  cz= cz + Math.cos(utils.degToRad(angle+90))*velocity;
  cx= cx - Math.sin(utils.degToRad(angle+90))*velocity;
}

function moveCameraRight(){
  console.log("direction = " +  angle);
  cz= cz + Math.cos(utils.degToRad(angle-90))*velocity;
  cx= cx - Math.sin(utils.degToRad(angle-90))*velocity;
}

function moveCameraBackward(){
  console.log("direction = " +  angle);
  cz= cz - Math.cos(utils.degToRad(angle+180))*velocity;
  cx= cx + Math.sin(utils.degToRad(angle+180))*velocity;
}

//---------------------------------------------------------------------------------------------------------

