var gl;
var baseDir;
var shaderDir;
var program;

//object used to store model data after being loaded
var loadedModelData = function(vao,indicesLength) {
  this.vao = vao;
  this.indicesLength = indicesLength;
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

  var dirLightAlpha = -utils.degToRad(-60);
  var dirLightBeta  = -utils.degToRad(120);
  var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
              Math.sin(dirLightAlpha), Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)];
  var directionalLightColor = [0.8, 1.0, 1.0];


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


  //-----------------loading models--------------------
  var bed = loadModel(bedModel,bedModelTexture);
  var chair = loadModel(chairModel,chairModelTexture);
  //---------------------------------------------------


  //-------------Define the scene Graph----------------
  var objects = [];

  var roomNode = new Node();
  roomNode.localMatrix = utils.MakeScaleMatrix(1,1,1);
  roomNode.drawInfo = {
    materialColor: [0.6, 0.6, 0.0],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: bed.vao,
    indicesLength: bed.indicesLength,
  };

  var bedNode = new Node();

  bedNode.localMatrix =utils.multiplyMatrices(utils.MakeRotateZMatrix(10),utils.multiplyMatrices(utils.MakeRotateYMatrix(90),utils.MakeTranslateMatrix(-1.5,-192,-32))); //Temporary for testing
  bedNode.drawInfo = {
    materialColor: [0.2, 0.5, 0.8],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: bed.vao,
    indicesLength: bed.indicesLength,
  };

  var chairNode = new Node();
  chairNode.localMatrix = utils.MakeRotateZMatrix(30);
  chairNode.drawInfo = {
    materialColor: [0.6, 0.6, 0.6],
    programInfo: program,
    bufferLength: indexData.length,
    vertexArray: chair.vao,
    indicesLength: chair.indicesLength,
  };

  bedNode.setParent(roomNode);
  chairNode.setParent(roomNode);

  var objects = [
    roomNode,
    bedNode,
    chairNode,
  ];
  //---------------SceneGraph defined-------------------

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.width / gl.canvas.height;
    var projectionMatrix = utils.MakePerspective(60.0, aspect, 1.0, 2000.0);

    // Compute the camera matrix using look at.
    var cameraPosition = [0.0, -200.0, 0.0];
    var target = [0.0, 0.0, 0.0];
    var up = [0.0, 0.0, 1.0];
    var cameraMatrix = utils.LookAt(cameraPosition, target, up);
    var viewMatrix = utils.invertMatrix(cameraMatrix);

    var viewProjectionMatrix = utils.multiplyMatrices(projectionMatrix, viewMatrix);

    // Update all world matrices in the scene graph
    roomNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function(object) {
      
      gl.useProgram(object.drawInfo.programInfo);
      
      var projectionMatrix = utils.multiplyMatrices(viewProjectionMatrix, object.worldMatrix);
      var normalMatrix = utils.invertMatrix(utils.transposeMatrix(object.worldMatrix));
    
      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));

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

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  //var uvAttributeLocation = gl.getAttribLocation(program, "a_uv");

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

/*  var uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(uvAttributeLocation);
  gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);*/

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  //loadTexture(modelTexture);

  return new loadedModelData(vao,indices.length);

}

/**Function used to load a texture*/
function loadTexture(modelTexture){
  var texture = gl.createTexture();
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
}



